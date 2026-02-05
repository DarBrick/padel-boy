import { z } from 'zod'

export const createTournamentSchema = z.object({
  eventType: z.enum(['americano', 'mexicano']),
  tournamentName: z.string().min(1).max(50),
  numberOfPlayers: z.number().min(4).max(40),
  numberOfCourts: z.number().min(1).max(10),
  pointsPerMatch: z.enum(['16', '21', '24', '32']),
  // Mexicano-specific fields
  matchupStyle: z.enum(['1&4vs2&3', '1&3vs2&4']).optional(),
  randomRounds: z.number().min(1).max(5).optional(),
})

export type CreateTournamentForm = z.infer<typeof createTournamentSchema>

// Binary format schemas (v1)

export const storedPlayerSchema = z.object({
  name: z.string().min(1).max(16),
})

export const storedMatchSchema = z.object({
  team1: z.tuple([z.number().min(0).max(39), z.number().min(0).max(39)]),
  team2: z.tuple([z.number().min(0).max(39), z.number().min(0).max(39)]),
  isFinished: z.boolean(),
  winner: z.number().min(0).max(1).optional(),
  scoreDelta: z.number().min(0).max(32).optional(),
})

export const storedTournamentSchema = z.object({
  // Header fields
  version: z.literal(1),
  format: z.enum(['americano', 'mexicano']),
  pointsPerGame: z.union([z.literal(16), z.literal(21), z.literal(24), z.literal(32)]),
  numberOfCourts: z.number().min(1).max(10),
  isFixedPairs: z.boolean(),
  playerCount: z.number().min(4).max(40),
  
  // Mexicano-specific
  mexicanoMatchupStyle: z.enum(['1&4vs2&3', '1&3vs2&4']).optional(),
  mexicanoRandomRounds: z.number().min(1).max(5).optional(),
  
  // ID and names
  id: z.string().length(9),
  name: z.string().min(1).max(40).optional(),
  courtNames: z.record(z.number().min(0).max(9), z.string().min(1).max(16)).optional(),
  
  // Data arrays
  players: z.array(storedPlayerSchema).min(4).max(40),
  matches: z.array(storedMatchSchema),
})

export type StoredPlayer = z.infer<typeof storedPlayerSchema>
export type StoredMatch = z.infer<typeof storedMatchSchema>
export type StoredTournament = z.infer<typeof storedTournamentSchema>
