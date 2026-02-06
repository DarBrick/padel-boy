import { describe, it, expect } from 'vitest'
import { getTournamentStats } from '../tournamentStats'
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

describe('getTournamentStats', () => {
  describe('tournament status', () => {
    it('returns setup status when no matches exist', () => {
      const tournament = createBaseTournament()
      const stats = getTournamentStats(tournament)

      expect(stats.status).toBe('setup')
      expect(stats.totalMatches).toBe(0)
      expect(stats.finishedMatches).toBe(0)
    })

    it('returns setup status when no matches are finished', () => {
      const tournament = createBaseTournament({
        matches: [
          createMatch([0, 1], [2, 3], false),
          createMatch([0, 2], [1, 3], false),
        ],
      })
      const stats = getTournamentStats(tournament)

      expect(stats.status).toBe('setup')
      expect(stats.totalMatches).toBe(2)
      expect(stats.finishedMatches).toBe(0)
    })

    it('returns playing status when some matches are finished', () => {
      const tournament = createBaseTournament({
        matches: [
          createMatch([0, 1], [2, 3], true, 0, 4),
          createMatch([0, 2], [1, 3], false),
        ],
      })
      const stats = getTournamentStats(tournament)

      expect(stats.status).toBe('playing')
      expect(stats.totalMatches).toBe(2)
      expect(stats.finishedMatches).toBe(1)
    })

    it('returns finished status when all matches are finished', () => {
      const tournament = createBaseTournament({
        matches: [
          createMatch([0, 1], [2, 3], true, 0, 4),
          createMatch([0, 2], [1, 3], true, 1, 6),
        ],
      })
      const stats = getTournamentStats(tournament)

      expect(stats.status).toBe('finished')
      expect(stats.totalMatches).toBe(2)
      expect(stats.finishedMatches).toBe(2)
    })
  })

  describe('round calculations', () => {
    it('calculates total rounds correctly', () => {
      const tournament = createBaseTournament({
        numberOfCourts: 2,
        matches: [
          createMatch([0, 1], [2, 3], false), // Round 1
          createMatch([0, 2], [1, 3], false), // Round 1
          createMatch([0, 3], [1, 2], false), // Round 2
        ],
      })
      const stats = getTournamentStats(tournament)

      expect(stats.totalRounds).toBe(2)
    })

    it('handles uneven matches per round', () => {
      const tournament = createBaseTournament({
        numberOfCourts: 2,
        matches: [
          createMatch([0, 1], [2, 3], false), // Round 1
          createMatch([0, 2], [1, 3], false), // Round 1
          createMatch([0, 3], [1, 2], false), // Round 2 (only 1 match)
        ],
      })
      const stats = getTournamentStats(tournament)

      expect(stats.totalRounds).toBe(2)
    })

    it('returns 0 completed rounds when no matches are finished', () => {
      const tournament = createBaseTournament({
        numberOfCourts: 2,
        matches: [
          createMatch([0, 1], [2, 3], false),
          createMatch([0, 2], [1, 3], false),
        ],
      })
      const stats = getTournamentStats(tournament)

      expect(stats.completedRounds).toBe(0)
    })

    it('counts completed rounds consecutively from the beginning', () => {
      const tournament = createBaseTournament({
        numberOfCourts: 2,
        matches: [
          createMatch([0, 1], [2, 3], true, 0, 4),  // Round 1 - complete
          createMatch([0, 2], [1, 3], true, 1, 6),  // Round 1 - complete
          createMatch([0, 3], [1, 2], true, 0, 8),  // Round 2 - complete
          createMatch([1, 2], [0, 3], true, 1, 2),  // Round 2 - complete
          createMatch([0, 1], [2, 3], false),       // Round 3 - incomplete
          createMatch([0, 2], [1, 3], false),       // Round 3 - incomplete
        ],
      })
      const stats = getTournamentStats(tournament)

      expect(stats.completedRounds).toBe(2)
    })

    it('stops counting completed rounds at first incomplete round', () => {
      const tournament = createBaseTournament({
        numberOfCourts: 2,
        matches: [
          createMatch([0, 1], [2, 3], true, 0, 4),  // Round 1 - complete
          createMatch([0, 2], [1, 3], true, 1, 6),  // Round 1 - complete
          createMatch([0, 3], [1, 2], false),       // Round 2 - incomplete
          createMatch([1, 2], [0, 3], false),       // Round 2 - incomplete
          createMatch([0, 1], [2, 3], true, 0, 4),  // Round 3 - complete (but doesn't count)
          createMatch([0, 2], [1, 3], true, 1, 6),  // Round 3 - complete (but doesn't count)
        ],
      })
      const stats = getTournamentStats(tournament)

      expect(stats.completedRounds).toBe(1)
    })

    it('handles partial rounds correctly', () => {
      const tournament = createBaseTournament({
        numberOfCourts: 2,
        matches: [
          createMatch([0, 1], [2, 3], true, 0, 4),  // Round 1 - only 1 of 2 finished
          createMatch([0, 2], [1, 3], false),       // Round 1 - incomplete
        ],
      })
      const stats = getTournamentStats(tournament)

      expect(stats.completedRounds).toBe(0)
    })
  })

  describe('player standings', () => {
    it('initializes all players with 0 points and 0 wins/draws/losses when no matches are finished', () => {
      const tournament = createBaseTournament({
        matches: [createMatch([0, 1], [2, 3], false)],
      })
      const stats = getTournamentStats(tournament)

      expect(stats.standings).toHaveLength(4)
      expect(stats.standings.every(p => p.points === 0)).toBe(true)
      expect(stats.standings.every(p => p.wins === 0)).toBe(true)
      expect(stats.standings.every(p => p.draws === 0)).toBe(true)
      expect(stats.standings.every(p => p.losses === 0)).toBe(true)
    })

    it('calculates winning team points correctly', () => {
      const tournament = createBaseTournament({
        pointsPerGame: 24,
        matches: [
          // Team 1 (Alice & Bob) wins with delta 4, so 24-20
          createMatch([0, 1], [2, 3], true, 0, 4),
        ],
      })
      const stats = getTournamentStats(tournament)

      // Winners get 24 points each and 1 win
      expect(stats.standings.find(p => p.name === 'Alice')?.points).toBe(24)
      expect(stats.standings.find(p => p.name === 'Alice')?.wins).toBe(1)
      expect(stats.standings.find(p => p.name === 'Alice')?.losses).toBe(0)
      expect(stats.standings.find(p => p.name === 'Bob')?.points).toBe(24)
      expect(stats.standings.find(p => p.name === 'Bob')?.wins).toBe(1)
      expect(stats.standings.find(p => p.name === 'Bob')?.losses).toBe(0)
      // Losers get 20 points each and 1 loss
      expect(stats.standings.find(p => p.name === 'Charlie')?.points).toBe(20)
      expect(stats.standings.find(p => p.name === 'Charlie')?.wins).toBe(0)
      expect(stats.standings.find(p => p.name === 'Charlie')?.losses).toBe(1)
      expect(stats.standings.find(p => p.name === 'Diana')?.points).toBe(20)
      expect(stats.standings.find(p => p.name === 'Diana')?.wins).toBe(0)
      expect(stats.standings.find(p => p.name === 'Diana')?.losses).toBe(1)
    })

    it('accumulates points across multiple matches', () => {
      const tournament = createBaseTournament({
        pointsPerGame: 24,
        matches: [
          // Match 1: Alice & Bob win (24 each), Charlie & Diana lose (20 each)
          createMatch([0, 1], [2, 3], true, 0, 4),
          // Match 2: Alice & Charlie win (24 each), Bob & Diana lose (18 each)
          createMatch([0, 2], [1, 3], true, 0, 6),
        ],
      })
      const stats = getTournamentStats(tournament)

      // Alice: 24 + 24 = 48
      expect(stats.standings.find(p => p.name === 'Alice')?.points).toBe(48)
      // Bob: 24 + 18 = 42
      expect(stats.standings.find(p => p.name === 'Bob')?.points).toBe(42)
      // Charlie: 20 + 24 = 44
      expect(stats.standings.find(p => p.name === 'Charlie')?.points).toBe(44)
      // Diana: 20 + 18 = 38
      expect(stats.standings.find(p => p.name === 'Diana')?.points).toBe(38)
    })

    it('sorts players by points descending', () => {
      const tournament = createBaseTournament({
        pointsPerGame: 24,
        matches: [
          createMatch([0, 1], [2, 3], true, 0, 4),  // Alice & Bob: 24, Charlie & Diana: 20
          createMatch([0, 2], [1, 3], true, 0, 6),  // Alice & Charlie: 24, Bob & Diana: 18
        ],
      })
      const stats = getTournamentStats(tournament)

      expect(stats.standings[0].name).toBe('Alice')
      expect(stats.standings[0].points).toBe(48)
      expect(stats.standings[1].name).toBe('Charlie')
      expect(stats.standings[1].points).toBe(44)
      expect(stats.standings[2].name).toBe('Bob')
      expect(stats.standings[2].points).toBe(42)
      expect(stats.standings[3].name).toBe('Diana')
      expect(stats.standings[3].points).toBe(38)
    })

    it('sorts alphabetically when points are equal', () => {
      const tournament = createBaseTournament({
        pointsPerGame: 24,
        players: [
          { name: 'Zara' },
          { name: 'Alice' },
          { name: 'Bob' },
          { name: 'Charlie' },
        ],
        matches: [
          // All players get 24 points
          createMatch([0, 1], [2, 3], true, 0, 0),
        ],
      })
      const stats = getTournamentStats(tournament)

      // When all points are equal, should be sorted alphabetically
      expect(stats.standings[0].name).toBe('Alice')
      expect(stats.standings[1].name).toBe('Bob')
      expect(stats.standings[2].name).toBe('Charlie')
      expect(stats.standings[3].name).toBe('Zara')
      expect(stats.standings.every(p => p.points === 24)).toBe(true)
    })

    it('tracks draws correctly when scoreDelta is 0', () => {
      const tournament = createBaseTournament({
        pointsPerGame: 24,
        matches: [
          // Draw: both teams get 24 points
          createMatch([0, 1], [2, 3], true, 0, 0),
        ],
      })
      const stats = getTournamentStats(tournament)

      // All players get 24 points and 1 draw
      expect(stats.standings.every(p => p.points === 24)).toBe(true)
      expect(stats.standings.every(p => p.draws === 1)).toBe(true)
      expect(stats.standings.every(p => p.wins === 0)).toBe(true)
      expect(stats.standings.every(p => p.losses === 0)).toBe(true)
    })

    it('sorts by wins when points are equal', () => {
      const tournament = createBaseTournament({
        pointsPerGame: 16,
        players: [
          { name: 'Alice' },
          { name: 'Bob' },
          { name: 'Charlie' },
          { name: 'Diana' },
        ],
        matches: [
          // Match 1: Alice & Bob win 16-12
          createMatch([0, 1], [2, 3], true, 0, 4),
          // Match 2: Charlie & Diana win 16-12
          createMatch([2, 3], [0, 1], true, 0, 4),
          // Match 3: Alice & Charlie draw 16-16
          createMatch([0, 2], [1, 3], true, 0, 0),
        ],
      })
      const stats = getTournamentStats(tournament)

      // All players have 44 points (16+12+16 or 16+12+16)
      expect(stats.standings.every(p => p.points === 44)).toBe(true)
      
      // All have 1 win, 1 draw, 1 loss
      expect(stats.standings.every(p => p.wins === 1)).toBe(true)
      expect(stats.standings.every(p => p.draws === 1)).toBe(true)
      expect(stats.standings.every(p => p.losses === 1)).toBe(true)

      // When all stats are equal, sort alphabetically
      expect(stats.standings[0].name).toBe('Alice')
      expect(stats.standings[1].name).toBe('Bob')
      expect(stats.standings[2].name).toBe('Charlie')
      expect(stats.standings[3].name).toBe('Diana')
    })

    it('sorts by draws when points and wins are equal', () => {
      const tournament = createBaseTournament({
        pointsPerGame: 21,
        players: [
          { name: 'Alice' },
          { name: 'Bob' },
          { name: 'Charlie' },
          { name: 'Diana' },
        ],
        matches: [
          // All draws, all get 21 points each match
          createMatch([0, 1], [2, 3], true, 0, 0), // Round 1
          createMatch([0, 2], [1, 3], true, 0, 0), // Round 2
          createMatch([0, 3], [1, 2], true, 0, 0), // Round 3
        ],
      })
      const stats = getTournamentStats(tournament)

      // All players: 63 points, 0 wins, 3 draws, 0 losses
      expect(stats.standings.every(p => p.points === 63)).toBe(true)
      expect(stats.standings.every(p => p.wins === 0)).toBe(true)
      expect(stats.standings.every(p => p.draws === 3)).toBe(true)
      expect(stats.standings.every(p => p.losses === 0)).toBe(true)
      
      // Should sort alphabetically
      expect(stats.standings[0].name).toBe('Alice')
      expect(stats.standings[1].name).toBe('Bob')
      expect(stats.standings[2].name).toBe('Charlie')
      expect(stats.standings[3].name).toBe('Diana')
    })

    it('applies complete sorting hierarchy: points > wins > draws > name', () => {
      const tournament = createBaseTournament({
        pointsPerGame: 24,
        playerCount: 6,
        players: [
          { name: 'Alice' },   // Will have most points
          { name: 'Bob' },     
          { name: 'Charlie' }, 
          { name: 'Diana' },   
          { name: 'Eve' },     
          { name: 'Frank' },   
        ],
        matches: [
          createMatch([0, 1], [2, 3], true, 0, 8),  // Alice & Bob win 24-16
          createMatch([0, 2], [1, 3], true, 0, 8),  // Alice & Charlie win 24-16
          createMatch([2, 3], [4, 5], true, 0, 0),  // Charlie & Diana draw with Eve & Frank
          createMatch([4, 5], [0, 1], true, 0, 0),  // Eve & Frank draw with Alice & Bob
        ],
      })
      const stats = getTournamentStats(tournament)

      // Alice: 24+24+24 = 72pts, 2W, 1D, 0L (most points, most wins)
      expect(stats.standings[0].name).toBe('Alice')
      expect(stats.standings[0].points).toBe(72)
      expect(stats.standings[0].wins).toBe(2)
      
      // Bob & Charlie both have 64pts, 1W, 1D, 1L - alphabetically Bob first
      expect(stats.standings[1].name).toBe('Bob')
      expect(stats.standings[1].points).toBe(64)
      expect(stats.standings[1].wins).toBe(1)
      
      expect(stats.standings[2].name).toBe('Charlie')
      expect(stats.standings[2].points).toBe(64)
      expect(stats.standings[2].wins).toBe(1)
      
      // Diana: 16+16+24 = 56pts, 0W, 1D, 2L
      expect(stats.standings[3].name).toBe('Diana')
      expect(stats.standings[3].points).toBe(56)
      
      // Eve & Frank both have 48pts, 0W, 2D, 0L - alphabetically Eve first
      expect(stats.standings[4].name).toBe('Eve')
      expect(stats.standings[4].points).toBe(48)
      expect(stats.standings[4].draws).toBe(2)
      
      expect(stats.standings[5].name).toBe('Frank')
      expect(stats.standings[5].points).toBe(48)
      expect(stats.standings[5].draws).toBe(2)
    })

    it('includes player index in standings', () => {
      const tournament = createBaseTournament()
      const stats = getTournamentStats(tournament)

      expect(stats.standings[0]).toMatchObject({ 
        name: 'Alice', 
        index: 0, 
        points: 0, 
        wins: 0, 
        draws: 0, 
        losses: 0 
      })
      expect(stats.standings[1]).toMatchObject({ name: 'Bob', index: 1 })
      expect(stats.standings[2]).toMatchObject({ name: 'Charlie', index: 2 })
      expect(stats.standings[3]).toMatchObject({ name: 'Diana', index: 3 })
    })

    it('ignores unfinished matches in point calculations', () => {
      const tournament = createBaseTournament({
        pointsPerGame: 24,
        matches: [
          createMatch([0, 1], [2, 3], true, 0, 4),
          createMatch([0, 2], [1, 3], false), // Not finished
        ],
      })
      const stats = getTournamentStats(tournament)

      expect(stats.standings.find(p => p.name === 'Alice')?.points).toBe(24)
      expect(stats.standings.find(p => p.name === 'Bob')?.points).toBe(24)
      expect(stats.standings.find(p => p.name === 'Charlie')?.points).toBe(20)
      expect(stats.standings.find(p => p.name === 'Diana')?.points).toBe(20)
    })

    it('ignores matches with missing winner or scoreDelta', () => {
      const tournament = createBaseTournament({
        pointsPerGame: 24,
        matches: [
          createMatch([0, 1], [2, 3], true, 0, 4),
          { team1: [0, 2], team2: [1, 3], isFinished: true, winner: undefined, scoreDelta: 6 },
          { team1: [0, 2], team2: [1, 3], isFinished: true, winner: 0, scoreDelta: undefined },
        ],
      })
      const stats = getTournamentStats(tournament)

      // Only the first match should count
      expect(stats.standings.find(p => p.name === 'Alice')?.points).toBe(24)
      expect(stats.standings.find(p => p.name === 'Bob')?.points).toBe(24)
    })
  })

  describe('top players', () => {
    it('returns top 3 players', () => {
      const tournament = createBaseTournament({
        pointsPerGame: 24,
        players: [
          { name: 'Alice' },   // Will have 48 points
          { name: 'Bob' },     // Will have 42 points
          { name: 'Charlie' }, // Will have 44 points
          { name: 'Diana' },   // Will have 38 points
          { name: 'Eve' },     // Will have 0 points
        ],
        playerCount: 5,
        matches: [
          createMatch([0, 1], [2, 3], true, 0, 4),
          createMatch([0, 2], [1, 3], true, 0, 6),
        ],
      })
      const stats = getTournamentStats(tournament)

      expect(stats.topPlayers).toHaveLength(3)
      expect(stats.topPlayers[0].name).toBe('Alice')
      expect(stats.topPlayers[1].name).toBe('Charlie')
      expect(stats.topPlayers[2].name).toBe('Bob')
    })

    it('returns fewer than 3 if tournament has fewer players', () => {
      const tournament = createBaseTournament({
        playerCount: 2,
        players: [{ name: 'Alice' }, { name: 'Bob' }],
      })
      const stats = getTournamentStats(tournament)

      expect(stats.topPlayers).toHaveLength(2)
    })

    it('returns empty array when no players exist', () => {
      const tournament = createBaseTournament({
        playerCount: 0,
        players: [],
      })
      const stats = getTournamentStats(tournament)

      expect(stats.topPlayers).toHaveLength(0)
      expect(stats.standings).toHaveLength(0)
    })
  })

  describe('different point values', () => {
    it('calculates correctly with 16 points per game', () => {
      const tournament = createBaseTournament({
        pointsPerGame: 16,
        matches: [
          createMatch([0, 1], [2, 3], true, 0, 4), // Winners: 16, Losers: 12
        ],
      })
      const stats = getTournamentStats(tournament)

      expect(stats.standings.find(p => p.name === 'Alice')?.points).toBe(16)
      expect(stats.standings.find(p => p.name === 'Charlie')?.points).toBe(12)
    })

    it('calculates correctly with 32 points per game', () => {
      const tournament = createBaseTournament({
        pointsPerGame: 32,
        matches: [
          createMatch([0, 1], [2, 3], true, 1, 8), // Losers: 32, Winners: 24
        ],
      })
      const stats = getTournamentStats(tournament)

      expect(stats.standings.find(p => p.name === 'Alice')?.points).toBe(24)
      expect(stats.standings.find(p => p.name === 'Charlie')?.points).toBe(32)
    })
  })

  describe('edge cases', () => {
    it('handles tournament with many players', () => {
      const players = Array.from({ length: 40 }, (_, i) => ({ name: `Player${i}` }))
      const tournament = createBaseTournament({
        playerCount: 40,
        players,
        matches: [
          createMatch([0, 1], [2, 3], true, 0, 4),
        ],
      })
      const stats = getTournamentStats(tournament)

      expect(stats.standings).toHaveLength(40)
      expect(stats.topPlayers).toHaveLength(3)
    })

    it('handles single court tournament', () => {
      const tournament = createBaseTournament({
        numberOfCourts: 1,
        matches: [
          createMatch([0, 1], [2, 3], true, 0, 4),
          createMatch([0, 2], [1, 3], false),
        ],
      })
      const stats = getTournamentStats(tournament)

      expect(stats.totalRounds).toBe(2)
      expect(stats.completedRounds).toBe(1)
    })

    it('handles many courts', () => {
      const tournament = createBaseTournament({
        numberOfCourts: 10,
        matches: Array.from({ length: 30 }, () => createMatch([0, 1], [2, 3], false)),
      })
      const stats = getTournamentStats(tournament)

      expect(stats.totalRounds).toBe(3)
    })
  })
})
