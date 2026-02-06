import type { StoredTournament } from '../schemas/tournament'

export type TournamentStatus = 'finished' | 'playing' | 'setup'

export interface PlayerStanding {
  name: string
  index: number
  points: number
  wins: number
  draws: number
  losses: number
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
 * Calculates comprehensive statistics for a tournament including status,
 * round progress, and player standings.
 */
export function getTournamentStats(tournament: StoredTournament): TournamentStats {
  const totalMatches = tournament.matches.length
  const finishedMatches = tournament.matches.filter(m => m.isFinished).length
  
  // Determine tournament status
  const status: TournamentStatus = 
    finishedMatches === totalMatches && totalMatches > 0 ? 'finished' :
    finishedMatches > 0 ? 'playing' : 'setup'

  // Calculate rounds
  const matchesPerRound = tournament.numberOfCourts
  const totalRounds = totalMatches > 0 ? Math.ceil(totalMatches / matchesPerRound) : 0
  
  // Count completed rounds (consecutive from the beginning)
  let completedRounds = 0
  for (let roundIndex = 0; roundIndex < totalRounds; roundIndex++) {
    const start = roundIndex * matchesPerRound
    const end = start + matchesPerRound
    const roundMatches = tournament.matches.slice(start, end)
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
  
  for (const match of tournament.matches) {
    if (!match.isFinished || match.winner === undefined || match.scoreDelta === undefined) continue

    const isDraw = match.scoreDelta === 0
    const losingScore = tournament.pointsPerGame - match.scoreDelta
    const team1Score = match.winner === 0 ? tournament.pointsPerGame : losingScore
    const team2Score = match.winner === 1 ? tournament.pointsPerGame : losingScore

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
  const standings: PlayerStanding[] = tournament.players
    .map((player, index) => ({ 
      name: player.name, 
      index, 
      points: pointsByPlayerIndex[index],
      wins: winsByPlayerIndex[index],
      draws: drawsByPlayerIndex[index],
      losses: lossesByPlayerIndex[index],
    }))
    .sort((a, b) => {
      // Primary: sort by points (descending)
      if (b.points !== a.points) return b.points - a.points
      // Secondary: sort by wins (descending)
      if (b.wins !== a.wins) return b.wins - a.wins
      // Tertiary: sort by draws (descending)
      if (b.draws !== a.draws) return b.draws - a.draws
      // Quaternary: sort alphabetically
      return a.name.localeCompare(b.name)
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
