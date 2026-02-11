import { describe, it, expect } from 'vitest'
import {
  getTotalRounds,
  getRoundMatches,
  isRoundComplete,
  getRemainingMatchCount,
  getPausingPlayers,
  isLastRound,
  isTournamentFinished,
  canGenerateNextRound,
  toGlobalMatchIndex,
  updateMatch,
  appendRoundMatches,
  finishTournament,
  formatTournamentDate,
  parseRoundParam,
} from '../tournamentState'
import type { StoredTournament, StoredMatch } from '../../schemas/tournament'

function createBaseTournament(overrides: Partial<StoredTournament> = {}): StoredTournament {
  return {
    version: 1,
    format: 'americano',
    pointsPerGame: 24,
    numberOfCourts: 2,
    isFixedPairs: false,
    playerCount: 4,
    id: 'test12345',
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

function createMatch(
  team1: [number, number],
  team2: [number, number],
  isFinished: boolean,
  winner?: 0 | 1,
  scoreDelta?: number
): StoredMatch {
  return {
    team1,
    team2,
    isFinished,
    winner,
    scoreDelta,
  }
}

describe('tournamentState', () => {
  describe('getTotalRounds', () => {
    it('returns 0 when no matches exist', () => {
      const tournament = createBaseTournament()
      expect(getTotalRounds(tournament)).toBe(0)
    })

    it('returns 1 when matches fit in one round', () => {
      const tournament = createBaseTournament({
        numberOfCourts: 2,
        matches: [
          createMatch([0, 1], [2, 3], false),
          createMatch([0, 2], [1, 3], false),
        ],
      })
      expect(getTotalRounds(tournament)).toBe(1)
    })

    it('returns 2 when matches span two rounds', () => {
      const tournament = createBaseTournament({
        numberOfCourts: 2,
        matches: [
          createMatch([0, 1], [2, 3], true, 0, 4),
          createMatch([0, 2], [1, 3], true, 1, 2),
          createMatch([0, 3], [1, 2], false),
          createMatch([1, 2], [0, 3], false),
        ],
      })
      expect(getTotalRounds(tournament)).toBe(2)
    })

    it('rounds up for partial rounds', () => {
      const tournament = createBaseTournament({
        numberOfCourts: 3,
        matches: [
          createMatch([0, 1], [2, 3], false),
          createMatch([0, 2], [1, 3], false),
          createMatch([0, 3], [1, 2], false),
          createMatch([1, 2], [0, 3], false), // 4th match -> round 2
        ],
      })
      expect(getTotalRounds(tournament)).toBe(2)
    })
  })

  describe('getRoundMatches', () => {
    it('returns empty array when no matches exist', () => {
      const tournament = createBaseTournament()
      expect(getRoundMatches(tournament, 1)).toEqual([])
    })

    it('returns empty array for invalid round number', () => {
      const tournament = createBaseTournament({
        matches: [createMatch([0, 1], [2, 3], false)],
      })
      expect(getRoundMatches(tournament, 0)).toEqual([])
      expect(getRoundMatches(tournament, -1)).toEqual([])
    })

    it('returns matches for first round', () => {
      const match1 = createMatch([0, 1], [2, 3], true, 0, 4)
      const match2 = createMatch([0, 2], [1, 3], true, 1, 2)
      const tournament = createBaseTournament({
        numberOfCourts: 2,
        matches: [match1, match2],
      })
      const result = getRoundMatches(tournament, 1)
      expect(result).toHaveLength(2)
      expect(result[0]).toEqual(match1)
      expect(result[1]).toEqual(match2)
    })

    it('returns matches for second round', () => {
      const match3 = createMatch([0, 3], [1, 2], false)
      const match4 = createMatch([1, 2], [0, 3], false)
      const tournament = createBaseTournament({
        numberOfCourts: 2,
        matches: [
          createMatch([0, 1], [2, 3], true, 0, 4),
          createMatch([0, 2], [1, 3], true, 1, 2),
          match3,
          match4,
        ],
      })
      const result = getRoundMatches(tournament, 2)
      expect(result).toHaveLength(2)
      expect(result[0]).toEqual(match3)
      expect(result[1]).toEqual(match4)
    })

    it('returns partial round matches', () => {
      const tournament = createBaseTournament({
        numberOfCourts: 3,
        matches: [
          createMatch([0, 1], [2, 3], true, 0, 4),
          createMatch([0, 2], [1, 3], true, 1, 2),
          createMatch([0, 3], [1, 2], true, 0, 6),
          createMatch([1, 2], [0, 3], false), // Only 1 match in round 2
        ],
      })
      expect(getRoundMatches(tournament, 2)).toHaveLength(1)
    })
  })

  describe('isRoundComplete', () => {
    it('returns false when no matches exist', () => {
      const tournament = createBaseTournament()
      expect(isRoundComplete(tournament, 1)).toBe(false)
    })

    it('returns false when some matches are unfinished', () => {
      const tournament = createBaseTournament({
        numberOfCourts: 2,
        matches: [
          createMatch([0, 1], [2, 3], true, 0, 4),
          createMatch([0, 2], [1, 3], false),
        ],
      })
      expect(isRoundComplete(tournament, 1)).toBe(false)
    })

    it('returns true when all matches in round are finished', () => {
      const tournament = createBaseTournament({
        numberOfCourts: 2,
        matches: [
          createMatch([0, 1], [2, 3], true, 0, 4),
          createMatch([0, 2], [1, 3], true, 1, 2),
        ],
      })
      expect(isRoundComplete(tournament, 1)).toBe(true)
    })

    it('checks correct round when multiple rounds exist', () => {
      const tournament = createBaseTournament({
        numberOfCourts: 2,
        matches: [
          createMatch([0, 1], [2, 3], true, 0, 4),
          createMatch([0, 2], [1, 3], true, 1, 2),
          createMatch([0, 3], [1, 2], false),
          createMatch([1, 2], [0, 3], false),
        ],
      })
      expect(isRoundComplete(tournament, 1)).toBe(true)
      expect(isRoundComplete(tournament, 2)).toBe(false)
    })
  })

  describe('getRemainingMatchCount', () => {
    it('returns 0 when no matches exist', () => {
      const tournament = createBaseTournament()
      expect(getRemainingMatchCount(tournament, 1)).toBe(0)
    })

    it('returns count of unfinished matches', () => {
      const tournament = createBaseTournament({
        numberOfCourts: 3,
        matches: [
          createMatch([0, 1], [2, 3], true, 0, 4),
          createMatch([0, 2], [1, 3], false),
          createMatch([0, 3], [1, 2], false),
        ],
      })
      expect(getRemainingMatchCount(tournament, 1)).toBe(2)
    })

    it('returns 0 when all matches are finished', () => {
      const tournament = createBaseTournament({
        matches: [
          createMatch([0, 1], [2, 3], true, 0, 4),
          createMatch([0, 2], [1, 3], true, 1, 2),
        ],
      })
      expect(getRemainingMatchCount(tournament, 1)).toBe(0)
    })
  })

  describe('getPausingPlayers', () => {
    it('returns empty array when no matches exist', () => {
      const tournament = createBaseTournament()
      expect(getPausingPlayers(tournament, 1)).toEqual([])
    })

    it('returns empty array when all players are playing', () => {
      const tournament = createBaseTournament({
        playerCount: 4,
        matches: [
          createMatch([0, 1], [2, 3], false),
        ],
      })
      expect(getPausingPlayers(tournament, 1)).toEqual([])
    })

    it('returns indices of players not in any match', () => {
      const tournament = createBaseTournament({
        playerCount: 6,
        players: [
          { name: 'Alice' },
          { name: 'Bob' },
          { name: 'Charlie' },
          { name: 'Diana' },
          { name: 'Eve' },
          { name: 'Frank' },
        ],
        matches: [
          createMatch([0, 1], [2, 3], false),
        ],
      })
      expect(getPausingPlayers(tournament, 1)).toEqual([4, 5])
    })

    it('correctly identifies pausing players across multiple matches', () => {
      const tournament = createBaseTournament({
        playerCount: 8,
        players: [
          { name: 'P1' },
          { name: 'P2' },
          { name: 'P3' },
          { name: 'P4' },
          { name: 'P5' },
          { name: 'P6' },
          { name: 'P7' },
          { name: 'P8' },
        ],
        numberOfCourts: 2,
        matches: [
          createMatch([0, 1], [2, 3], false),
          createMatch([4, 5], [6, 7], false),
        ],
      })
      // All players are playing in round 1
      expect(getPausingPlayers(tournament, 1)).toEqual([])
    })

    it('identifies pausing players in second round', () => {
      const tournament = createBaseTournament({
        playerCount: 6,
        players: [
          { name: 'Alice' },
          { name: 'Bob' },
          { name: 'Charlie' },
          { name: 'Diana' },
          { name: 'Eve' },
          { name: 'Frank' },
        ],
        numberOfCourts: 2,
        matches: [
          // Round 1
          createMatch([0, 1], [2, 3], true, 0, 4),
          createMatch([4, 5], [0, 1], true, 1, 2),
          // Round 2
          createMatch([0, 2], [1, 3], false),
          createMatch([2, 3], [4, 5], false),
        ],
      })
      expect(getPausingPlayers(tournament, 2)).toEqual([])
    })
  })

  describe('isLastRound', () => {
    it('returns true for round 1 when only 1 round exists', () => {
      const tournament = createBaseTournament({
        matches: [createMatch([0, 1], [2, 3], false)],
      })
      expect(isLastRound(tournament, 1)).toBe(true)
    })

    it('returns false for round 1 when 2 rounds exist', () => {
      const tournament = createBaseTournament({
        numberOfCourts: 2,
        matches: [
          createMatch([0, 1], [2, 3], false),
          createMatch([0, 2], [1, 3], false),
          createMatch([0, 3], [1, 2], false),
        ],
      })
      expect(isLastRound(tournament, 1)).toBe(false)
      expect(isLastRound(tournament, 2)).toBe(true)
    })

    it('returns false when no matches exist', () => {
      const tournament = createBaseTournament()
      expect(isLastRound(tournament, 1)).toBe(false)
    })
  })

  describe('isTournamentFinished', () => {
    it('returns false when finishedAt is not set', () => {
      const tournament = createBaseTournament()
      expect(isTournamentFinished(tournament)).toBe(false)
    })

    it('returns true when finishedAt is set', () => {
      const tournament = createBaseTournament({
        finishedAt: Date.now(),
      })
      expect(isTournamentFinished(tournament)).toBe(true)
    })
  })

  describe('canGenerateNextRound', () => {
    it('returns false when tournament is finished', () => {
      const tournament = createBaseTournament({
        matches: [
          createMatch([0, 1], [2, 3], true, 0, 4),
        ],
        finishedAt: Date.now(),
      })
      expect(canGenerateNextRound(tournament, 1)).toBe(false)
    })

    it('returns false when not on last round', () => {
      const tournament = createBaseTournament({
        numberOfCourts: 2,
        matches: [
          createMatch([0, 1], [2, 3], true, 0, 4),
          createMatch([0, 2], [1, 3], true, 1, 2),
          createMatch([0, 3], [1, 2], false),
          createMatch([1, 2], [0, 3], false),
        ],
      })
      expect(canGenerateNextRound(tournament, 1)).toBe(false)
    })

    it('returns false when last round is not complete', () => {
      const tournament = createBaseTournament({
        matches: [
          createMatch([0, 1], [2, 3], false),
        ],
      })
      expect(canGenerateNextRound(tournament, 1)).toBe(false)
    })

    it('returns true when on last round and round is complete', () => {
      const tournament = createBaseTournament({
        matches: [
          createMatch([0, 1], [2, 3], true, 0, 4),
        ],
      })
      expect(canGenerateNextRound(tournament, 1)).toBe(true)
    })
  })

  describe('toGlobalMatchIndex', () => {
    it('returns correct index for first round, first match', () => {
      const tournament = createBaseTournament({ numberOfCourts: 2 })
      expect(toGlobalMatchIndex(tournament, 1, 0)).toBe(0)
    })

    it('returns correct index for first round, second match', () => {
      const tournament = createBaseTournament({ numberOfCourts: 2 })
      expect(toGlobalMatchIndex(tournament, 1, 1)).toBe(1)
    })

    it('returns correct index for second round, first match', () => {
      const tournament = createBaseTournament({ numberOfCourts: 2 })
      expect(toGlobalMatchIndex(tournament, 2, 0)).toBe(2)
    })

    it('returns correct index for third round with 3 courts', () => {
      const tournament = createBaseTournament({ numberOfCourts: 3 })
      expect(toGlobalMatchIndex(tournament, 3, 2)).toBe(8)
    })
  })

  describe('updateMatch', () => {
    it('updates match at correct position', () => {
      const tournament = createBaseTournament({
        numberOfCourts: 2,
        matches: [
          createMatch([0, 1], [2, 3], false),
          createMatch([0, 2], [1, 3], false),
        ],
      })

      const updatedMatch = createMatch([0, 1], [2, 3], true, 0, 4)
      const result = updateMatch(tournament, 1, 0, updatedMatch)

      expect(result.matches[0]).toEqual(updatedMatch)
      expect(result.matches[1]).toEqual(tournament.matches[1])
    })

    it('updates match in second round', () => {
      const tournament = createBaseTournament({
        numberOfCourts: 2,
        matches: [
          createMatch([0, 1], [2, 3], true, 0, 4),
          createMatch([0, 2], [1, 3], true, 1, 2),
          createMatch([0, 3], [1, 2], false),
          createMatch([1, 2], [0, 3], false),
        ],
      })

      const updatedMatch = createMatch([0, 3], [1, 2], true, 1, 6)
      const result = updateMatch(tournament, 2, 0, updatedMatch)

      expect(result.matches[2]).toEqual(updatedMatch)
      expect(result.matches[0]).toEqual(tournament.matches[0])
      expect(result.matches[3]).toEqual(tournament.matches[3])
    })

    it('does not mutate original tournament', () => {
      const tournament = createBaseTournament({
        matches: [createMatch([0, 1], [2, 3], false)],
      })

      const updatedMatch = createMatch([0, 1], [2, 3], true, 0, 4)
      const result = updateMatch(tournament, 1, 0, updatedMatch)

      expect(tournament.matches[0].isFinished).toBe(false)
      expect(result.matches[0].isFinished).toBe(true)
    })
  })

  describe('appendRoundMatches', () => {
    it('appends matches to empty tournament', () => {
      const tournament = createBaseTournament()
      const newMatches = [
        createMatch([0, 1], [2, 3], false),
        createMatch([0, 2], [1, 3], false),
      ]

      const result = appendRoundMatches(tournament, newMatches)

      expect(result.matches).toHaveLength(2)
      expect(result.matches).toEqual(newMatches)
    })

    it('appends matches to existing matches', () => {
      const tournament = createBaseTournament({
        matches: [
          createMatch([0, 1], [2, 3], true, 0, 4),
        ],
      })
      const newMatches = [
        createMatch([0, 2], [1, 3], false),
      ]

      const result = appendRoundMatches(tournament, newMatches)

      expect(result.matches).toHaveLength(2)
      expect(result.matches[0]).toEqual(tournament.matches[0])
      expect(result.matches[1]).toEqual(newMatches[0])
    })

    it('does not mutate original tournament', () => {
      const tournament = createBaseTournament({
        matches: [createMatch([0, 1], [2, 3], false)],
      })
      const newMatches = [createMatch([0, 2], [1, 3], false)]

      const result = appendRoundMatches(tournament, newMatches)

      expect(tournament.matches).toHaveLength(1)
      expect(result.matches).toHaveLength(2)
    })
  })

  describe('finishTournament', () => {
    it('sets finishedAt timestamp', () => {
      const tournament = createBaseTournament()
      const before = Date.now()
      const result = finishTournament(tournament)
      const after = Date.now()

      expect(result.finishedAt).toBeDefined()
      expect(result.finishedAt).toBeGreaterThanOrEqual(before)
      expect(result.finishedAt).toBeLessThanOrEqual(after)
    })

    it('does not mutate original tournament', () => {
      const tournament = createBaseTournament()
      const result = finishTournament(tournament)

      expect(tournament.finishedAt).toBeUndefined()
      expect(result.finishedAt).toBeDefined()
    })
  })

  describe('formatTournamentDate', () => {
    it('formats date from tournament ID', () => {
      // Tournament epoch is 2025-01-01
      // Test with a date 100 hours after epoch (approximately 2025-01-05)
      const hoursAfterEpoch = 100
      const timestamp = hoursAfterEpoch.toString(36).padStart(5, '0')
      
      const tournament = createBaseTournament({
        id: timestamp + 'test',
      })

      const result = formatTournamentDate(tournament, 'en-US')
      expect(result).toContain('2025')
      expect(result).toContain('Jan')
    })

    it('returns empty string for invalid ID', () => {
      const tournament = createBaseTournament({
        id: 'toolong123', // 10 chars instead of 9
      })

      const result = formatTournamentDate(tournament)
      expect(result).toBe('')
    })
  })

  describe('parseRoundParam', () => {
    it('returns last round when no param provided', () => {
      const tournament = createBaseTournament({
        numberOfCourts: 2,
        matches: [
          createMatch([0, 1], [2, 3], false),
          createMatch([0, 2], [1, 3], false),
          createMatch([0, 3], [1, 2], false),
        ],
      })

      expect(parseRoundParam(tournament, null)).toBe(2)
    })

    it('returns 1 when tournament has no matches', () => {
      const tournament = createBaseTournament()
      expect(parseRoundParam(tournament, null)).toBe(1)
    })

    it('returns parsed valid round number', () => {
      const tournament = createBaseTournament({
        numberOfCourts: 2,
        matches: [
          createMatch([0, 1], [2, 3], false),
          createMatch([0, 2], [1, 3], false),
          createMatch([0, 3], [1, 2], false),
        ],
      })

      expect(parseRoundParam(tournament, '1')).toBe(1)
      expect(parseRoundParam(tournament, '2')).toBe(2)
    })

    it('clamps to last round when param is too high', () => {
      const tournament = createBaseTournament({
        numberOfCourts: 2,
        matches: [
          createMatch([0, 1], [2, 3], false),
          createMatch([0, 2], [1, 3], false),
        ],
      })

      expect(parseRoundParam(tournament, '10')).toBe(1)
    })

    it('returns last round when param is invalid', () => {
      const tournament = createBaseTournament({
        numberOfCourts: 2,
        matches: [
          createMatch([0, 1], [2, 3], false),
          createMatch([0, 2], [1, 3], false),
          createMatch([0, 3], [1, 2], false),
        ],
      })

      expect(parseRoundParam(tournament, 'invalid')).toBe(2)
      expect(parseRoundParam(tournament, '0')).toBe(2)
      expect(parseRoundParam(tournament, '-1')).toBe(2)
    })
  })
})
