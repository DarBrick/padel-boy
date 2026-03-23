import { describe, expect, it } from 'vitest'
import type { StoredTournament } from '../../schemas/tournament'
import { getNextReopenedTournamentName } from '../tournament'

function createTournament(overrides: Partial<StoredTournament> = {}): StoredTournament {
  return {
    version: 1,
    format: 'americano',
    pointsPerGame: 24,
    numberOfCourts: 2,
    isFixedPairs: false,
    playerCount: 4,
    id: '00000abcd',
    players: [
      { name: 'Alice' },
      { name: 'Bob' },
      { name: 'Charlie' },
      { name: 'Diana' },
    ],
    matches: [],
    ...overrides,
  }
}

describe('tournament helpers', () => {
  describe('getNextReopenedTournamentName', () => {
    it('returns v2 for the first reopened named tournament', () => {
      const sourceTournament = createTournament({ name: 'Spring Open' })

      expect(getNextReopenedTournamentName(sourceTournament, [sourceTournament])).toBe('Spring Open (v2)')
    })

    it('increments version when reopened copies already exist', () => {
      const sourceTournament = createTournament({ name: 'Spring Open' })
      const reopenedV2 = createTournament({ id: '00000efgh', name: 'Spring Open (v2)' })
      const reopenedV3 = createTournament({ id: '00000ijkl', name: 'Spring Open (v3)' })

      expect(getNextReopenedTournamentName(sourceTournament, [sourceTournament, reopenedV2, reopenedV3])).toBe('Spring Open (v4)')
    })

    it('continues versioning when reopening an already versioned tournament', () => {
      const originalTournament = createTournament({ name: 'Spring Open' })
      const sourceTournament = createTournament({ id: '00000efgh', name: 'Spring Open (v2)' })

      expect(getNextReopenedTournamentName(sourceTournament, [originalTournament, sourceTournament])).toBe('Spring Open (v3)')
    })

    it('ignores tournaments from different encoded datetimes', () => {
      const sourceTournament = createTournament({ name: 'Spring Open' })
      const differentSeriesTournament = createTournament({ id: '00001abcd', name: 'Spring Open (v8)' })

      expect(getNextReopenedTournamentName(sourceTournament, [sourceTournament, differentSeriesTournament])).toBe('Spring Open (v2)')
    })

    it('returns undefined for unnamed tournaments', () => {
      const sourceTournament = createTournament()

      expect(getNextReopenedTournamentName(sourceTournament, [sourceTournament])).toBeUndefined()
    })
  })
})