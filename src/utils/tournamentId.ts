/**
 * Tournament ID Generation
 * 
 * Generates 9-character time-based IDs for tournaments
 * Format: 5 chars hours-since-epoch (base36) + 4 chars random (base36)
 */

const TOURNAMENT_EPOCH = new Date('2025-01-01').getTime()
const HOUR_MS = 60 * 60 * 1000
const MAX_TIMESTAMP_HOURS = 36 ** 5 - 1

export function generateTournamentId(date?: Date): string {
  const now = date ? date.getTime() : Date.now()
  const hoursSinceEpoch = Math.floor((now - TOURNAMENT_EPOCH) / HOUR_MS)
  if (hoursSinceEpoch < 0 || hoursSinceEpoch > MAX_TIMESTAMP_HOURS) {
    throw new Error('Date out of supported tournament ID range')
  }

  const timestamp = hoursSinceEpoch.toString(36).padStart(5, '0')
  const random = Math.random().toString(36).substring(2, 6).padEnd(4, '0')
  return timestamp + random
}

export function extractTimestampFromId(id: string): Date {
  if (id.length !== 9) {
    throw new Error('Invalid tournament ID length')
  }
  
  const timestampPart = id.slice(0, 5)
  const parsed = parseInt(timestampPart, 36)
  if (Number.isNaN(parsed)) {
    throw new Error('Invalid tournament ID timestamp')
  }

  if (parsed < 0 || parsed > MAX_TIMESTAMP_HOURS) {
    throw new Error('Invalid tournament ID timestamp')
  }

  // Hours since epoch (hour-level precision).
  const dateMs = TOURNAMENT_EPOCH + parsed * HOUR_MS
  return new Date(dateMs)
}
