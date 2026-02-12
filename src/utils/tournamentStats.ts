import type { StoredTournament } from '../schemas/tournament'

export type TournamentStatus = 'finished' | 'playing' | 'setup'

export interface PlayerStanding {
  name: string
  index: number
  rank: number
  points: number
  wins: number
  draws: number
  losses: number
  gamesPlayed: number
  gamesSitting: number
  pointsPerGame: number
  winRate: number
  pointsFromSitting: number
  totalPointsWithSitting: number
}

export interface TournamentStats {
  status: TournamentStatus
  totalMatches: number
  finishedMatches: number
  totalRounds: number
  completedRounds: number
  standings: PlayerStanding[]
  topPlayers: PlayerStanding[]
}

/**
 * Compares two player standings for ranking purposes.
 * Returns negative if 'a' should rank higher, positive if 'b' should rank higher, 0 if equal.
 * Does not include alphabetical comparison - use as a tiebreaker if needed.
 */
export function comparePlayerStandings(a: PlayerStanding, b: PlayerStanding): number {
  // Primary: sort by points per game (descending)
  if (Math.abs(b.pointsPerGame - a.pointsPerGame) > 0.001) {
    return b.pointsPerGame - a.pointsPerGame
  }
  // Secondary: sort by win rate (descending)
  if (Math.abs(b.winRate - a.winRate) > 0.001) {
    return b.winRate - a.winRate
  }
  // Tertiary: sort by total points with sitting (descending)
  if (b.totalPointsWithSitting !== a.totalPointsWithSitting) {
    return b.totalPointsWithSitting - a.totalPointsWithSitting
  }
  // Quaternary: sort by total wins (descending)
  if (b.wins !== a.wins) return b.wins - a.wins
  // Quinary: sort by total draws (descending)
  if (b.draws !== a.draws) return b.draws - a.draws
  // Equal rankings
  return 0
}

/**
 * Calculates comprehensive statistics for a tournament including status,
 * round progress, and player standings.
 * @param tournament The tournament to analyze
 * @param upToRound Optional round number to limit calculations (inclusive)
 */
export function getTournamentStats(tournament: StoredTournament, upToRound?: number): TournamentStats {
  const matchesPerRound = tournament.numberOfCourts
  
  // Filter matches if upToRound is specified
  const matchesToConsider = upToRound !== undefined
    ? tournament.matches.slice(0, upToRound * matchesPerRound)
    : tournament.matches
  
  const totalMatches = matchesToConsider.length
  const finishedMatches = matchesToConsider.filter(m => m.isFinished).length
  
  // Determine tournament status
  const status: TournamentStatus = 
    finishedMatches === totalMatches && totalMatches > 0 ? 'finished' :
    finishedMatches > 0 ? 'playing' : 'setup'

  // Calculate rounds
  const totalRounds = totalMatches > 0 ? Math.ceil(totalMatches / matchesPerRound) : 0
  
  // Count completed rounds (consecutive from the beginning)
  let completedRounds = 0
  for (let roundIndex = 0; roundIndex < totalRounds; roundIndex++) {
    const start = roundIndex * matchesPerRound
    const end = start + matchesPerRound
    const roundMatches = matchesToConsider.slice(start, end)
    if (roundMatches.length === 0) break
    const roundComplete = roundMatches.every(m => m.isFinished)
    if (!roundComplete) break
    completedRounds++
  }

  // Calculate player points and match results from finished matches
  const pointsByPlayerIndex = new Array(tournament.players.length).fill(0)
  const winsByPlayerIndex = new Array(tournament.players.length).fill(0)
  const drawsByPlayerIndex = new Array(tournament.players.length).fill(0)
  const lossesByPlayerIndex = new Array(tournament.players.length).fill(0)
  
  for (const match of matchesToConsider) {
    if (!match.isFinished || match.winner === undefined || match.scoreDelta === undefined) continue

    const isDraw = match.scoreDelta === 0
    const winningScore = Math.floor((tournament.pointsPerGame + match.scoreDelta) / 2)
    const losingScore = Math.floor((tournament.pointsPerGame - match.scoreDelta) / 2)
    const team1Score = match.winner === 0 ? winningScore : losingScore
    const team2Score = match.winner === 1 ? winningScore : losingScore

    for (const playerIndex of match.team1) {
      pointsByPlayerIndex[playerIndex] += team1Score
      if (isDraw) {
        drawsByPlayerIndex[playerIndex]++
      } else if (match.winner === 0) {
        winsByPlayerIndex[playerIndex]++
      } else {
        lossesByPlayerIndex[playerIndex]++
      }
    }
    for (const playerIndex of match.team2) {
      pointsByPlayerIndex[playerIndex] += team2Score
      if (isDraw) {
        drawsByPlayerIndex[playerIndex]++
      } else if (match.winner === 1) {
        winsByPlayerIndex[playerIndex]++
      } else {
        lossesByPlayerIndex[playerIndex]++
      }
    }
  }

  // Create and sort standings
  const sittingPointsPerRound = Math.ceil(tournament.pointsPerGame * 0.5)
  
  const standings: PlayerStanding[] = tournament.players
    .map((player, index) => {
      const wins = winsByPlayerIndex[index]
      const draws = drawsByPlayerIndex[index]
      const losses = lossesByPlayerIndex[index]
      const points = pointsByPlayerIndex[index]
      const gamesPlayed = wins + draws + losses
      const gamesSitting = completedRounds - gamesPlayed
      const pointsPerGame = gamesPlayed > 0 ? points / gamesPlayed : 0
      const winRate = gamesPlayed > 0 ? wins / gamesPlayed : 0
      const pointsFromSitting = gamesSitting * sittingPointsPerRound
      const totalPointsWithSitting = points + pointsFromSitting
      
      return {
        name: player.name,
        index,
        rank: 0, // Will be set after sorting
        points,
        wins,
        draws,
        losses,
        gamesPlayed,
        gamesSitting,
        pointsPerGame,
        winRate,
        pointsFromSitting,
        totalPointsWithSitting,
      }
    })
    .sort((a, b) => {
      // Use comparison utility function
      const comparison = comparePlayerStandings(a, b)
      if (comparison !== 0) return comparison
      // Alphabetical sort as final tiebreaker
      return a.name.localeCompare(b.name)
    })
  
  // Assign ranks based on sorted order, with tied players getting the same rank
  let currentRank = 1
  standings.forEach((standing, index) => {
    if (index > 0) {
      const comparison = comparePlayerStandings(standings[index - 1], standing)
      if (comparison !== 0) {
        // Different ranking criteria, increment rank to actual position
        currentRank = index + 1
      }
      // If comparison is 0, keep the same rank (tied)
    }
    standing.rank = currentRank
  })

  const topPlayers = standings.slice(0, 3)

  return {
    status,
    totalMatches,
    finishedMatches,
    totalRounds,
    completedRounds,
    standings,
    topPlayers,
  }
}
