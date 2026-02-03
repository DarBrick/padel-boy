export interface Player {
  id: string
  name: string
  emoji?: string
}

export interface Match {
  id: string
  round: number
  court: number
  team1: [string, string] // Player IDs
  team2: [string, string]
  score1?: number
  score2?: number
  status: 'pending' | 'playing' | 'finished'
}

export interface Tournament {
  id: string
  name: string
  format: 'americano' | 'mexicano'
  players: Player[]
  matches: Match[]
  currentRound: number
  pointsPerGame: number
  courts: number
  status: 'setup' | 'playing' | 'finished'
  createdAt: Date
}

export interface PlayerStanding {
  playerId: string
  playerName: string
  points: number
  gamesPlayed: number
  gamesWon: number
}
