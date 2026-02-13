import type { StoredTournament, StoredMatch } from '../schemas/tournament'
import { getTournamentStats } from './tournamentStats'
import { getRoundMatches, getTotalRounds, getPlayerMatchOutcome } from './tournamentState'

// ── Partnership Types ──────────────────────────────────────────────

export interface PartnershipStats {
  player1Index: number
  player2Index: number
  player1Name: string
  player2Name: string
  gamesPlayed: number
  wins: number
  losses: number
  draws: number
  winRate: number
  pointsGained: number
  avgPointsPerGame: number
}

// ── Opponent Types ─────────────────────────────────────────────────

export interface OpponentStats {
  opponentIndex: number
  opponentName: string
  gamesPlayed: number
  pointsScored: number
  avgPointsPerGame: number
}

// ── Match Superlative Types ────────────────────────────────────────

export interface MatchSuperlative {
  roundNumber: number
  matchIndexInRound: number
  team1: [number, number]
  team2: [number, number]
  team1Names: [string, string]
  team2Names: [string, string]
  score1: number
  score2: number
  scoreDelta: number
}

export interface MatchSuperlatives {
  closestMatch?: MatchSuperlative
  biggestBlowout?: MatchSuperlative
  highestScoring?: MatchSuperlative
}

// ── Standings Progression Types ────────────────────────────────────

export interface RoundStanding {
  playerIndex: number
  playerName: string
  rank: number
  points: number
  pointsPerGame: number
  gamesPlayed: number
  totalPointsWithSitting: number
  outcome: 'won' | 'lost' | 'drew' | 'paused'
}

export interface StandingsProgression {
  rounds: number[]
  playerProgressions: Map<number, RoundStanding[]>
}

// ── Player Consistency Types ────────────────────────────────────────

export interface PlayerConsistency {
  playerIndex: number
  playerName: string
  gamesPlayed: number
  averageScore: number
  scoreVariance: number
  scoreStdDev: number
  minScore: number
  maxScore: number
  scoreRange: number
}

// ── Partnership Stats ──────────────────────────────────────────────

/**
 * Calculate statistics for all player partnerships (pairs who played together)
 * Returns sorted by win rate (descending), then games played (descending)
 */
export function getPartnershipStats(tournament: StoredTournament): PartnershipStats[] {
  // Map: "index1-index2" -> stats
  const partnershipMap = new Map<string, PartnershipStats>()

  const finishedMatches = tournament.matches.filter(m => m.isFinished)

  finishedMatches.forEach(match => {
    if (match.winner === undefined || match.scoreDelta === undefined) return

    const isDraw = match.scoreDelta === 0
    const winningScore = Math.floor((tournament.pointsPerGame + match.scoreDelta) / 2)
    const losingScore = Math.floor((tournament.pointsPerGame - match.scoreDelta) / 2)

    // Process team1
    const [p1, p2] = match.team1.sort((a, b) => a - b)
    const key1 = `${p1}-${p2}`
    if (!partnershipMap.has(key1)) {
      partnershipMap.set(key1, {
        player1Index: p1,
        player2Index: p2,
        player1Name: tournament.players[p1].name,
        player2Name: tournament.players[p2].name,
        gamesPlayed: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        winRate: 0,
        pointsGained: 0,
        avgPointsPerGame: 0,
      })
    }
    const stats1 = partnershipMap.get(key1)!
    stats1.gamesPlayed++
    if (isDraw) {
      stats1.draws++
      stats1.pointsGained += winningScore // In a draw, both teams get the same score
    } else if (match.winner === 0) {
      stats1.wins++
      stats1.pointsGained += winningScore
    } else {
      stats1.losses++
      stats1.pointsGained += losingScore
    }

    // Process team2
    const [p3, p4] = match.team2.sort((a, b) => a - b)
    const key2 = `${p3}-${p4}`
    if (!partnershipMap.has(key2)) {
      partnershipMap.set(key2, {
        player1Index: p3,
        player2Index: p4,
        player1Name: tournament.players[p3].name,
        player2Name: tournament.players[p4].name,
        gamesPlayed: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        winRate: 0,
        pointsGained: 0,
        avgPointsPerGame: 0,
      })
    }
    const stats2 = partnershipMap.get(key2)!
    stats2.gamesPlayed++
    if (isDraw) {
      stats2.draws++
      stats2.pointsGained += winningScore // In a draw, both teams get the same score
    } else if (match.winner === 1) {
      stats2.wins++
      stats2.pointsGained += winningScore
    } else {
      stats2.losses++
      stats2.pointsGained += losingScore
    }
  })

  // Calculate win rates, averages and convert to array
  const partnerships = Array.from(partnershipMap.values()).map(stats => ({
    ...stats,
    winRate: stats.gamesPlayed > 0 ? stats.wins / stats.gamesPlayed : 0,
    avgPointsPerGame: stats.gamesPlayed > 0 ? stats.pointsGained / stats.gamesPlayed : 0,
  }))

  // Sort by points gained (desc), then games played (desc)
  partnerships.sort((a, b) => {
    if (b.pointsGained !== a.pointsGained) {
      return b.pointsGained - a.pointsGained
    }
    return b.gamesPlayed - a.gamesPlayed
  })

  return partnerships
}

// ── Opponent Stats ─────────────────────────────────────────────────

/**
 * Calculate statistics for opponents a specific player has faced
 * Returns sorted by points scored (descending), then games played (descending)
 */
export function getOpponentStats(tournament: StoredTournament, playerIndex: number): OpponentStats[] {
  // Map: opponentIndex -> stats
  const opponentMap = new Map<number, OpponentStats>()

  const finishedMatches = tournament.matches.filter(m => m.isFinished)

  finishedMatches.forEach(match => {
    if (match.winner === undefined || match.scoreDelta === undefined) return

    const winningScore = Math.floor((tournament.pointsPerGame + match.scoreDelta) / 2)
    const losingScore = Math.floor((tournament.pointsPerGame - match.scoreDelta) / 2)

    // Check if player is on team1
    if (match.team1.includes(playerIndex)) {
      const playerScore = match.winner === 0 ? winningScore : losingScore
      
      // Add stats for each opponent on team2
      match.team2.forEach(opponentIndex => {
        if (!opponentMap.has(opponentIndex)) {
          opponentMap.set(opponentIndex, {
            opponentIndex,
            opponentName: tournament.players[opponentIndex].name,
            gamesPlayed: 0,
            pointsScored: 0,
            avgPointsPerGame: 0,
          })
        }
        const stats = opponentMap.get(opponentIndex)!
        stats.gamesPlayed++
        stats.pointsScored += playerScore
      })
    }
    // Check if player is on team2
    else if (match.team2.includes(playerIndex)) {
      const playerScore = match.winner === 1 ? winningScore : losingScore
      
      // Add stats for each opponent on team1
      match.team1.forEach(opponentIndex => {
        if (!opponentMap.has(opponentIndex)) {
          opponentMap.set(opponentIndex, {
            opponentIndex,
            opponentName: tournament.players[opponentIndex].name,
            gamesPlayed: 0,
            pointsScored: 0,
            avgPointsPerGame: 0,
          })
        }
        const stats = opponentMap.get(opponentIndex)!
        stats.gamesPlayed++
        stats.pointsScored += playerScore
      })
    }
  })

  // Calculate averages and convert to array
  const opponents = Array.from(opponentMap.values()).map(stats => ({
    ...stats,
    avgPointsPerGame: stats.gamesPlayed > 0 ? stats.pointsScored / stats.gamesPlayed : 0,
  }))

  // Sort by points scored (desc), then games played (desc)
  opponents.sort((a, b) => {
    if (b.pointsScored !== a.pointsScored) {
      return b.pointsScored - a.pointsScored
    }
    return b.gamesPlayed - a.gamesPlayed
  })

  return opponents
}

// ── Match Superlatives ─────────────────────────────────────────────

/**
 * Find notable matches: closest, biggest blowout, highest-scoring
 */
export function getMatchSuperlatives(tournament: StoredTournament): MatchSuperlatives {
  const finishedMatches: Array<{ match: StoredMatch; round: number; index: number }> = []

  const totalRounds = getTotalRounds(tournament)
  for (let round = 1; round <= totalRounds; round++) {
    const roundMatches = getRoundMatches(tournament, round)
    roundMatches.forEach((match, index) => {
      if (match.isFinished && match.winner !== undefined && match.scoreDelta !== undefined) {
        finishedMatches.push({ match, round, index })
      }
    })
  }

  if (finishedMatches.length === 0) {
    return {}
  }

  const createSuperlative = (
    match: StoredMatch,
    round: number,
    index: number,
  ): MatchSuperlative => {
    const winningScore = Math.floor((tournament.pointsPerGame + match.scoreDelta!) / 2)
    const losingScore = Math.floor((tournament.pointsPerGame - match.scoreDelta!) / 2)
    const score1 = match.winner === 0 ? winningScore : losingScore
    const score2 = match.winner === 1 ? winningScore : losingScore

    return {
      roundNumber: round,
      matchIndexInRound: index,
      team1: match.team1,
      team2: match.team2,
      team1Names: [
        tournament.players[match.team1[0]].name,
        tournament.players[match.team1[1]].name,
      ] as [string, string],
      team2Names: [
        tournament.players[match.team2[0]].name,
        tournament.players[match.team2[1]].name,
      ] as [string, string],
      score1,
      score2,
      scoreDelta: match.scoreDelta!,
    }
  }

  // Closest match (smallest scoreDelta > 0)
  const closestData = finishedMatches
    .filter(({ match }) => match.scoreDelta! > 0)
    .sort((a, b) => a.match.scoreDelta! - b.match.scoreDelta!)[0]

  // Biggest blowout (largest scoreDelta)
  const blowoutData = finishedMatches.sort(
    (a, b) => b.match.scoreDelta! - a.match.scoreDelta!,
  )[0]

  // Highest scoring (sum of both scores)
  const highestData = finishedMatches.sort((a, b) => {
    const sumA =
      Math.floor((tournament.pointsPerGame + a.match.scoreDelta!) / 2) +
      Math.floor((tournament.pointsPerGame - a.match.scoreDelta!) / 2)
    const sumB =
      Math.floor((tournament.pointsPerGame + b.match.scoreDelta!) / 2) +
      Math.floor((tournament.pointsPerGame - b.match.scoreDelta!) / 2)
    return sumB - sumA
  })[0]

  return {
    closestMatch: closestData
      ? createSuperlative(closestData.match, closestData.round, closestData.index)
      : undefined,
    biggestBlowout: blowoutData
      ? createSuperlative(blowoutData.match, blowoutData.round, blowoutData.index)
      : undefined,
    highestScoring: highestData
      ? createSuperlative(highestData.match, highestData.round, highestData.index)
      : undefined,
  }
}

// ── Standings Progression ──────────────────────────────────────────

/**
 * Calculate cumulative standings after each completed round
 * Returns a map of playerIndex -> array of standings per round
 */
export function getStandingsProgression(tournament: StoredTournament): StandingsProgression {
  const totalRounds = getTotalRounds(tournament)
  const rounds: number[] = []
  const playerProgressions = new Map<number, RoundStanding[]>()

  // Initialize progression arrays for each player
  tournament.players.forEach((_, index) => {
    playerProgressions.set(index, [])
  })

  // Build a cumulative tournament for each round
  for (let round = 1; round <= totalRounds; round++) {
    const roundMatches = getRoundMatches(tournament, round)
    if (roundMatches.length === 0) break

    // Only include this round if all matches are finished
    const allFinished = roundMatches.every(m => m.isFinished)
    if (!allFinished) break

    rounds.push(round)

    // Create a partial tournament up to this round
    const partialTournament: StoredTournament = {
      ...tournament,
      matches: tournament.matches.slice(0, round * tournament.numberOfCourts),
    }

    // Calculate standings for this partial tournament
    const stats = getTournamentStats(partialTournament)

    // Record each player's standing for this round
    stats.standings.forEach((standing, rank) => {
      const progression = playerProgressions.get(standing.index)!
      
      // Get the outcome for this specific round
      const outcomeData = getPlayerMatchOutcome(tournament, standing.index, round)
      
      progression.push({
        playerIndex: standing.index,
        playerName: standing.name,
        rank: rank + 1, // 1-indexed rank
        points: standing.points,
        pointsPerGame: standing.pointsPerGame,
        gamesPlayed: standing.gamesPlayed,
        totalPointsWithSitting: standing.totalPointsWithSitting,
        outcome: outcomeData.outcome,
      })
    })
  }

  return {
    rounds,
    playerProgressions,
  }
}

// ── Player Consistency ─────────────────────────────────────────────

/**
 * Calculate score variance and consistency metrics for each player
 * Returns sorted by score variance (ascending = more consistent)
 */
export function getPlayerConsistency(tournament: StoredTournament): PlayerConsistency[] {
  // Collect all scores for each player
  const playerScores = new Map<number, number[]>()
  tournament.players.forEach((_, index) => {
    playerScores.set(index, [])
  })

  const finishedMatches = tournament.matches.filter(
    m => m.isFinished && m.scoreDelta !== undefined,
  )

  finishedMatches.forEach(match => {
    const winningScore = Math.floor((tournament.pointsPerGame + match.scoreDelta!) / 2)
    const losingScore = Math.floor((tournament.pointsPerGame - match.scoreDelta!) / 2)
    
    // For draws (winner undefined), both teams get the same score
    const score1 = match.winner === undefined ? winningScore : (match.winner === 0 ? winningScore : losingScore)
    const score2 = match.winner === undefined ? winningScore : (match.winner === 1 ? winningScore : losingScore)

    match.team1.forEach(playerIndex => {
      playerScores.get(playerIndex)!.push(score1)
    })
    match.team2.forEach(playerIndex => {
      playerScores.get(playerIndex)!.push(score2)
    })
  })

  // Calculate consistency metrics for each player
  const consistencies: PlayerConsistency[] = []

  tournament.players.forEach((player, index) => {
    const scores = playerScores.get(index)!
    if (scores.length === 0) return

    const gamesPlayed = scores.length
    const sum = scores.reduce((acc, score) => acc + score, 0)
    const average = sum / gamesPlayed

    const squaredDiffs = scores.map(score => Math.pow(score - average, 2))
    const variance = squaredDiffs.reduce((acc, diff) => acc + diff, 0) / gamesPlayed
    const stdDev = Math.sqrt(variance)

    const minScore = Math.min(...scores)
    const maxScore = Math.max(...scores)

    consistencies.push({
      playerIndex: index,
      playerName: player.name,
      gamesPlayed,
      averageScore: average,
      scoreVariance: variance,
      scoreStdDev: stdDev,
      minScore,
      maxScore,
      scoreRange: maxScore - minScore,
    })
  })

  // Sort by variance (ascending = more consistent)
  consistencies.sort((a, b) => a.scoreVariance - b.scoreVariance)

  return consistencies
}
