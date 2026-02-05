/**
 * Tournament ID Generation
 * 
 * Generates 9-character time-based IDs for tournaments
 * Format: 5 chars timestamp (base36) + 4 chars random (base36)
 */

const TOURNAMENT_EPOCH = new Date('2025-01-01').getTime()

export function generateTournamentId(): string {
  const timestamp = (Date.now() - TOURNAMENT_EPOCH).toString(36).padStart(5, '0')
  const random = Math.random().toString(36).slice(2, 6).padEnd(4, '0')
  return timestamp + random
}

export function extractTimestampFromId(id: string): Date {
  if (id.length !== 9) {
    throw new Error('Invalid tournament ID length')
  }
  
  const timestampPart = id.slice(0, 5)
  const timestamp = parseInt(timestampPart, 36) + TOURNAMENT_EPOCH
  return new Date(timestamp)
}
