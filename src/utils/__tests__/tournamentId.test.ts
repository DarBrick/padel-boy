import { describe, it, expect, vi, afterEach } from 'vitest'
import { generateTournamentId, extractTimestampFromId } from '../tournamentId'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('tournamentId', () => {
  it('generates a 9-character base36 id (5 timestamp + 4 random)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)

    const id = generateTournamentId(new Date('2025-01-01T00:00:00.000Z'))

    expect(id).toHaveLength(9)
    expect(id).toMatch(/^[0-9a-z]{9}$/)
    expect(id.slice(0, 5)).toHaveLength(5)
    expect(id.slice(5)).toHaveLength(4)
    expect(id.endsWith('0000')).toBe(true)
  })

  it('uses Date.now() when no date is provided', () => {
    const epoch = new Date('2025-01-01').getTime()
    const now = epoch + 12_345

    vi.spyOn(Date, 'now').mockReturnValue(now)
    vi.spyOn(Math, 'random').mockReturnValue(0)

    const id = generateTournamentId()

    // With hour-level precision, 12s after epoch is still hour 0.
    expect(id).toBe('000000000')
  })

  it('extracts year/month/day/hour from the id (hour-level precision)', () => {
    const epoch = new Date('2025-01-01').getTime()
    const date = new Date(epoch + 5 * 60 * 60 * 1000 + 1_234)

    vi.spyOn(Math, 'random').mockReturnValue(0)

    const id = generateTournamentId(date)
    const extracted = extractTimestampFromId(id)

    expect(extracted.getUTCFullYear()).toBe(date.getUTCFullYear())
    expect(extracted.getUTCMonth()).toBe(date.getUTCMonth())
    expect(extracted.getUTCDate()).toBe(date.getUTCDate())
    expect(extracted.getUTCHours()).toBe(date.getUTCHours())
    expect(extracted.getUTCMinutes()).toBe(0)
    expect(extracted.getUTCSeconds()).toBe(0)
  })

  it('throws on invalid id length', () => {
    expect(() => extractTimestampFromId('short')).toThrow('Invalid tournament ID length')
    expect(() => extractTimestampFromId('toolong1234')).toThrow('Invalid tournament ID length')
  })
})
