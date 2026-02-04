import { z } from 'zod'

export const createTournamentSchema = z.object({
  eventType: z.enum(['americano', 'mexicano']),
  tournamentName: z.string().min(1).max(50),
  numberOfPlayers: z.number().min(4).max(40),
  numberOfCourts: z.number().min(1).max(10),
  pointsPerMatch: z.enum([16, 21, 24, 32]),
  // Mexicano-specific fields
  matchupStyle: z.enum(['1&4vs2&3', '1&3vs2&4']).optional(),
  randomRounds: z.number().min(1).max(5).optional(),
})

export type CreateTournamentForm = z.infer<typeof createTournamentSchema>
