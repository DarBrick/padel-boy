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
      expect(stats.standings.every(p => p.gamesPlayed === 0)).toBe(true)
      expect(stats.standings.every(p => p.gamesSitting === 0)).toBe(true)
      expect(stats.standings.every(p => p.pointsPerGame === 0)).toBe(true)
      expect(stats.standings.every(p => p.winRate === 0)).toBe(true)
      expect(stats.standings.every(p => p.pointsFromSitting === 0)).toBe(true)
      expect(stats.standings.every(p => p.totalPointsWithSitting === 0)).toBe(true)
    })

    it('calculates winning team points correctly', () => {
      const tournament = createBaseTournament({
        pointsPerGame: 24,
        matches: [
          // Team 1 (Alice & Bob) wins with delta 4, so 14-10
          createMatch([0, 1], [2, 3], true, 0, 4),
        ],
      })
      const stats = getTournamentStats(tournament)

      // Winners get 14 points each and 1 win (24+4)/2 = 14
      expect(stats.standings.find(p => p.name === 'Alice')?.points).toBe(14)
      expect(stats.standings.find(p => p.name === 'Alice')?.wins).toBe(1)
      expect(stats.standings.find(p => p.name === 'Alice')?.losses).toBe(0)
      expect(stats.standings.find(p => p.name === 'Bob')?.points).toBe(14)
      expect(stats.standings.find(p => p.name === 'Bob')?.wins).toBe(1)
      expect(stats.standings.find(p => p.name === 'Bob')?.losses).toBe(0)
      // Losers get 10 points each and 1 loss (24-4)/2 = 10
      expect(stats.standings.find(p => p.name === 'Charlie')?.points).toBe(10)
      expect(stats.standings.find(p => p.name === 'Charlie')?.wins).toBe(0)
      expect(stats.standings.find(p => p.name === 'Charlie')?.losses).toBe(1)
      expect(stats.standings.find(p => p.name === 'Diana')?.points).toBe(10)
      expect(stats.standings.find(p => p.name === 'Diana')?.wins).toBe(0)
      expect(stats.standings.find(p => p.name === 'Diana')?.losses).toBe(1)
    })

    it('accumulates points across multiple matches', () => {
      const tournament = createBaseTournament({
        pointsPerGame: 24,
        matches: [
          // Match 1: Alice & Bob win 14-10, Charlie & Diana lose
          createMatch([0, 1], [2, 3], true, 0, 4),
          // Match 2: Alice & Charlie win 15-9, Bob & Diana lose
          createMatch([0, 2], [1, 3], true, 0, 6),
        ],
      })
      const stats = getTournamentStats(tournament)

      // Alice: 14 + 15 = 29
      expect(stats.standings.find(p => p.name === 'Alice')?.points).toBe(29)
      // Bob: 14 + 9 = 23
      expect(stats.standings.find(p => p.name === 'Bob')?.points).toBe(23)
      // Charlie: 10 + 15 = 25
      expect(stats.standings.find(p => p.name === 'Charlie')?.points).toBe(25)
      // Diana: 10 + 9 = 19
      expect(stats.standings.find(p => p.name === 'Diana')?.points).toBe(19)
    })

    it('sorts players by points descending', () => {
      const tournament = createBaseTournament({
        pointsPerGame: 24,
        matches: [
          createMatch([0, 1], [2, 3], true, 0, 4),  // Alice & Bob: 14, Charlie & Diana: 10
          createMatch([0, 2], [1, 3], true, 0, 6),  // Alice & Charlie: 15, Bob & Diana: 9
        ],
      })
      const stats = getTournamentStats(tournament)

      expect(stats.standings[0].name).toBe('Alice')
      expect(stats.standings[0].points).toBe(29)
      expect(stats.standings[1].name).toBe('Charlie')
      expect(stats.standings[1].points).toBe(25)
      expect(stats.standings[2].name).toBe('Bob')
      expect(stats.standings[2].points).toBe(23)
      expect(stats.standings[3].name).toBe('Diana')
      expect(stats.standings[3].points).toBe(19)
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
          // Draw: all players get 12 points
          createMatch([0, 1], [2, 3], true, 0, 0),
        ],
      })
      const stats = getTournamentStats(tournament)

      // When all points are equal, should be sorted alphabetically
      expect(stats.standings[0].name).toBe('Alice')
      expect(stats.standings[1].name).toBe('Bob')
      expect(stats.standings[2].name).toBe('Charlie')
      expect(stats.standings[3].name).toBe('Zara')
      expect(stats.standings.every(p => p.points === 12)).toBe(true)
    })

    it('tracks draws correctly when scoreDelta is 0', () => {
      const tournament = createBaseTournament({
        pointsPerGame: 24,
        matches: [
          // Draw: both teams get 12 points
          createMatch([0, 1], [2, 3], true, 0, 0),
        ],
      })
      const stats = getTournamentStats(tournament)

      // All players get 12 points and 1 draw
      expect(stats.standings.every(p => p.points === 12)).toBe(true)
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
          // Match 1: Alice & Bob win 10-6
          createMatch([0, 1], [2, 3], true, 0, 4),
          // Match 2: Charlie & Diana win 10-6
          createMatch([2, 3], [0, 1], true, 0, 4),
          // Match 3: Alice & Charlie draw 8-8
          createMatch([0, 2], [1, 3], true, 0, 0),
        ],
      })
      const stats = getTournamentStats(tournament)

      // All players have 24 points (10+6+8 or 6+10+8)
      expect(stats.standings.every(p => p.points === 24)).toBe(true)
      
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
          // All draws, all get 10 points each match (21/2 = 10.5 floored to 10)
          createMatch([0, 1], [2, 3], true, 0, 0), // Round 1
          createMatch([0, 2], [1, 3], true, 0, 0), // Round 2
          createMatch([0, 3], [1, 2], true, 0, 0), // Round 3
        ],
      })
      const stats = getTournamentStats(tournament)

      // All players: 30 points, 0 wins, 3 draws, 0 losses
      expect(stats.standings.every(p => p.points === 30)).toBe(true)
      expect(stats.standings.every(p => p.wins === 0)).toBe(true)
      expect(stats.standings.every(p => p.draws === 3)).toBe(true)
      expect(stats.standings.every(p => p.losses === 0)).toBe(true)
      
      // Should sort alphabetically
      expect(stats.standings[0].name).toBe('Alice')
      expect(stats.standings[1].name).toBe('Bob')
      expect(stats.standings[2].name).toBe('Charlie')
      expect(stats.standings[3].name).toBe('Diana')
    })

    it('applies complete sorting hierarchy: ppg > winRate > points > wins > draws > name', () => {
      const tournament = createBaseTournament({
        pointsPerGame: 24,
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
          createMatch([0, 1], [2, 3], true, 0, 8),  // Alice & Bob win 16-8
          createMatch([0, 2], [1, 3], true, 0, 8),  // Alice & Charlie win 16-8
          createMatch([2, 3], [4, 5], true, 0, 0),  // Charlie & Diana draw 12-12 with Eve & Frank
          createMatch([4, 5], [0, 1], true, 0, 0),  // Eve & Frank draw 12-12 with Alice & Bob
        ],
      })
      const stats = getTournamentStats(tournament)

      // Recalculate with PPG-based sorting:
      // Alice: 44pts / 3 games = 14.67 PPG, 2W, 1D = 0.667 win rate
      // Bob: 36pts / 3 games = 12 PPG, 1W, 1D, 1L = 0.333 win rate
      // Charlie: 36pts / 3 games = 12 PPG, 1W, 1D, 1L = 0.333 win rate
      // Diana: 28pts / 3 games = 9.33 PPG, 0W, 1D, 2L = 0 win rate
      // Eve: 24pts / 2 games = 12 PPG, 0W, 2D = 0 win rate
      // Frank: 24pts / 2 games = 12 PPG, 0W, 2D = 0 win rate
      
      // Sort order:
      // 1. Alice (14.67 PPG, 0.667 WR)
      // 2. Bob (12 PPG, 0.333 WR, alphabetically before Charlie)
      // 3. Charlie (12 PPG, 0.333 WR, alphabetically before Eve)
      // 4. Eve (12 PPG, 0 WR, alphabetically before Frank)
      // 5. Frank (12 PPG, 0 WR)
      // 6. Diana (9.33 PPG)

      expect(stats.standings[0].name).toBe('Alice')
      expect(stats.standings[0].pointsPerGame).toBeCloseTo(14.67, 1)
      expect(stats.standings[0].winRate).toBeCloseTo(2/3)
      
      expect(stats.standings[1].name).toBe('Bob')
      expect(stats.standings[1].pointsPerGame).toBe(12)
      expect(stats.standings[1].winRate).toBeCloseTo(1/3)
      
      expect(stats.standings[2].name).toBe('Charlie')
      expect(stats.standings[2].pointsPerGame).toBe(12)
      
      expect(stats.standings[3].name).toBe('Eve')
      expect(stats.standings[3].pointsPerGame).toBe(12)
      expect(stats.standings[3].winRate).toBe(0)
      
      expect(stats.standings[4].name).toBe('Frank')
      expect(stats.standings[4].pointsPerGame).toBe(12)
      
      expect(stats.standings[5].name).toBe('Diana')
      expect(stats.standings[5].pointsPerGame).toBeCloseTo(9.33, 1)
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
        losses: 0,
        gamesPlayed: 0,
        gamesSitting: 0,
        pointsPerGame: 0,
        winRate: 0,
        pointsFromSitting: 0,
        totalPointsWithSitting: 0,
      })
      expect(stats.standings[1]).toMatchObject({ name: 'Bob', index: 1 })
      expect(stats.standings[2]).toMatchObject({ name: 'Charlie', index: 2 })
      expect(stats.standings[3]).toMatchObject({ name: 'Diana', index: 3 })
    })

    it('calculates pointsFromSitting with 50% of format points (rounded up)', () => {
      const tournament = createBaseTournament({
        pointsPerGame: 21,
        numberOfCourts: 1,
        playerCount: 5,
        players: [
          { name: 'Alice' },
          { name: 'Bob' },
          { name: 'Charlie' },
          { name: 'Diana' },
          { name: 'Eve' },
        ],
        matches: [
          createMatch([0, 1], [2, 3], true, 0, 4),  // Round 1 (Eve sits)
          createMatch([0, 2], [3, 4], true, 1, 6),  // Round 2 (Bob sits)
        ],
      })
      const stats = getTournamentStats(tournament)

      // 21 * 0.5 = 10.5, rounded up = 11 points per sitting round
      // Eve sat 1 round: 11 points
      expect(stats.standings.find(p => p.name === 'Eve')?.pointsFromSitting).toBe(11)
      // Bob sat 1 round: 11 points
      expect(stats.standings.find(p => p.name === 'Bob')?.pointsFromSitting).toBe(11)
      // Others didn't sit
      expect(stats.standings.find(p => p.name === 'Alice')?.pointsFromSitting).toBe(0)
      expect(stats.standings.find(p => p.name === 'Charlie')?.pointsFromSitting).toBe(0)
      expect(stats.standings.find(p => p.name === 'Diana')?.pointsFromSitting).toBe(0)
    })

    it('calculates pointsFromSitting for different point formats', () => {
      // Test 16 points: 50% = 8
      const tournament16 = createBaseTournament({
        pointsPerGame: 16,
        numberOfCourts: 1,
        playerCount: 5,
        players: [
          { name: 'Alice' },
          { name: 'Bob' },
          { name: 'Charlie' },
          { name: 'Diana' },
          { name: 'Eve' },
        ],
        matches: [
          createMatch([0, 1], [2, 3], true, 0, 4),  // Eve sits
        ],
      })
      const stats16 = getTournamentStats(tournament16)
      expect(stats16.standings.find(p => p.name === 'Eve')?.pointsFromSitting).toBe(8)

      // Test 24 points: 50% = 12
      const tournament24 = createBaseTournament({
        pointsPerGame: 24,
        numberOfCourts: 1,
        playerCount: 5,
        players: [
          { name: 'Alice' },
          { name: 'Bob' },
          { name: 'Charlie' },
          { name: 'Diana' },
          { name: 'Eve' },
        ],
        matches: [
          createMatch([0, 1], [2, 3], true, 0, 4),  // Eve sits
        ],
      })
      const stats24 = getTournamentStats(tournament24)
      expect(stats24.standings.find(p => p.name === 'Eve')?.pointsFromSitting).toBe(12)

      // Test 32 points: 50% = 16
      const tournament32 = createBaseTournament({
        pointsPerGame: 32,
        numberOfCourts: 1,
        playerCount: 5,
        players: [
          { name: 'Alice' },
          { name: 'Bob' },
          { name: 'Charlie' },
          { name: 'Diana' },
          { name: 'Eve' },
        ],
        matches: [
          createMatch([0, 1], [2, 3], true, 0, 4),  // Eve sits
        ],
      })
      const stats32 = getTournamentStats(tournament32)
      expect(stats32.standings.find(p => p.name === 'Eve')?.pointsFromSitting).toBe(16)
    })

    it('calculates totalPointsWithSitting correctly', () => {
      const tournament = createBaseTournament({
        pointsPerGame: 24,
        numberOfCourts: 1,
        playerCount: 5,
        players: [
          { name: 'Alice' },
          { name: 'Bob' },
          { name: 'Charlie' },
          { name: 'Diana' },
          { name: 'Eve' },
        ],
        matches: [
          createMatch([0, 1], [2, 3], true, 0, 4),  // Round 1: Alice & Bob win 14-10, Eve sits
          createMatch([0, 2], [3, 4], true, 1, 6),  // Round 2: Diana & Eve win 15-9, Bob sits
        ],
      })
      const stats = getTournamentStats(tournament)

      // 24 * 0.5 = 12 points per sitting round
      // Alice: 14+9 = 23 earned, 0 sitting, total = 23
      expect(stats.standings.find(p => p.name === 'Alice')?.totalPointsWithSitting).toBe(23)
      // Bob: 14 earned, 12 sitting, total = 26
      expect(stats.standings.find(p => p.name === 'Bob')?.totalPointsWithSitting).toBe(26)
      // Eve: 15 earned, 12 sitting, total = 27
      expect(stats.standings.find(p => p.name === 'Eve')?.totalPointsWithSitting).toBe(27)
      // Charlie: 10+9 = 19 earned, 0 sitting, total = 19
      expect(stats.standings.find(p => p.name === 'Charlie')?.totalPointsWithSitting).toBe(19)
      // Diana: 10+15 = 25 earned, 0 sitting, total = 25
      expect(stats.standings.find(p => p.name === 'Diana')?.totalPointsWithSitting).toBe(25)
    })

    it('accumulates sitting points over multiple rounds', () => {
      const tournament = createBaseTournament({
        pointsPerGame: 24,
        numberOfCourts: 1,
        playerCount: 5,
        players: [
          { name: 'Alice' },
          { name: 'Bob' },
          { name: 'Charlie' },
          { name: 'Diana' },
          { name: 'Eve' },
        ],
        matches: [
          createMatch([0, 1], [2, 3], true, 0, 4),  // Round 1: Eve sits
          createMatch([0, 2], [3, 4], true, 1, 6),  // Round 2: Bob sits
          createMatch([1, 3], [0, 4], true, 0, 8),  // Round 3: Charlie sits
        ],
      })
      const stats = getTournamentStats(tournament)

      // 12 points per sitting round
      // Alice: played all 3 rounds, 0 sitting points
      expect(stats.standings.find(p => p.name === 'Alice')?.pointsFromSitting).toBe(0)
      // Bob: sat 1 round, 12 sitting points
      expect(stats.standings.find(p => p.name === 'Bob')?.pointsFromSitting).toBe(12)
      // Charlie: sat 1 round, 12 sitting points
      expect(stats.standings.find(p => p.name === 'Charlie')?.pointsFromSitting).toBe(12)
      // Diana: played all 3 rounds, 0 sitting points
      expect(stats.standings.find(p => p.name === 'Diana')?.pointsFromSitting).toBe(0)
      // Eve: sat 1 round, 12 sitting points
      expect(stats.standings.find(p => p.name === 'Eve')?.pointsFromSitting).toBe(12)
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

      expect(stats.standings.find(p => p.name === 'Alice')?.points).toBe(14)
      expect(stats.standings.find(p => p.name === 'Bob')?.points).toBe(14)
      expect(stats.standings.find(p => p.name === 'Charlie')?.points).toBe(10)
      expect(stats.standings.find(p => p.name === 'Diana')?.points).toBe(10)
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
      expect(stats.standings.find(p => p.name === 'Alice')?.points).toBe(14)
      expect(stats.standings.find(p => p.name === 'Bob')?.points).toBe(14)
    })

    it('calculates gamesPlayed correctly', () => {
      const tournament = createBaseTournament({
        pointsPerGame: 24,
        matches: [
          createMatch([0, 1], [2, 3], true, 0, 4),  // Alice & Bob win over Charlie & Diana
          createMatch([0, 2], [1, 3], true, 1, 6),  // Bob & Diana win over Alice & Charlie
          createMatch([0, 3], [1, 2], true, 0, 0),  // Alice & Diana draw with Bob & Charlie
        ],
      })
      const stats = getTournamentStats(tournament)

      // All players played 3 games each
      expect(stats.standings.find(p => p.name === 'Alice')?.gamesPlayed).toBe(3)
      expect(stats.standings.find(p => p.name === 'Bob')?.gamesPlayed).toBe(3)
      expect(stats.standings.find(p => p.name === 'Charlie')?.gamesPlayed).toBe(3)
      expect(stats.standings.find(p => p.name === 'Diana')?.gamesPlayed).toBe(3)
    })

    it('calculates gamesSitting correctly', () => {
      const tournament = createBaseTournament({
        pointsPerGame: 24,
        numberOfCourts: 1,
        playerCount: 5,
        players: [
          { name: 'Alice' },
          { name: 'Bob' },
          { name: 'Charlie' },
          { name: 'Diana' },
          { name: 'Eve' },
        ],
        matches: [
          createMatch([0, 1], [2, 3], true, 0, 4),  // Round 1 complete (Eve sits)
          createMatch([0, 2], [3, 4], true, 1, 6),  // Round 2 complete (Bob sits)
        ],
      })
      const stats = getTournamentStats(tournament)

      // 2 completed rounds, only 4 play per round (one sits out)
      // Alice played 2 games, sat out 0
      // Bob played 1 game, sat out 1
      // Charlie played 2 games, sat out 0
      // Diana played 2 games, sat out 0
      // Eve played 1 game, sat out 1
      expect(stats.standings.find(p => p.name === 'Alice')?.gamesSitting).toBe(0)
      expect(stats.standings.find(p => p.name === 'Bob')?.gamesSitting).toBe(1)
      expect(stats.standings.find(p => p.name === 'Charlie')?.gamesSitting).toBe(0)
      expect(stats.standings.find(p => p.name === 'Diana')?.gamesSitting).toBe(0)
      expect(stats.standings.find(p => p.name === 'Eve')?.gamesSitting).toBe(1)
    })

    it('calculates pointsPerGame correctly', () => {
      const tournament = createBaseTournament({
        pointsPerGame: 24,
        matches: [
          createMatch([0, 1], [2, 3], true, 0, 4),  // Alice & Bob: 14, Charlie & Diana: 10
          createMatch([0, 2], [1, 3], true, 1, 6),  // Bob & Diana: 15, Alice & Charlie: 9
        ],
      })
      const stats = getTournamentStats(tournament)

      // Alice: 23 points / 2 games = 11.5 PPG
      expect(stats.standings.find(p => p.name === 'Alice')?.pointsPerGame).toBe(11.5)
      // Bob: 29 points / 2 games = 14.5 PPG
      expect(stats.standings.find(p => p.name === 'Bob')?.pointsPerGame).toBe(14.5)
      // Charlie: 19 points / 2 games = 9.5 PPG
      expect(stats.standings.find(p => p.name === 'Charlie')?.pointsPerGame).toBe(9.5)
      // Diana: 25 points / 2 games = 12.5 PPG
      expect(stats.standings.find(p => p.name === 'Diana')?.pointsPerGame).toBe(12.5)
    })

    it('calculates winRate correctly', () => {
      const tournament = createBaseTournament({
        pointsPerGame: 24,
        matches: [
          createMatch([0, 1], [2, 3], true, 0, 4),  // Alice & Bob win over Charlie & Diana
          createMatch([0, 2], [1, 3], true, 1, 6),  // Bob & Diana win over Alice & Charlie
          createMatch([0, 3], [1, 2], true, 0, 0),  // Alice & Diana draw with Bob & Charlie
        ],
      })
      const stats = getTournamentStats(tournament)

      // Alice: 1 win, 1 draw, 1 loss / 3 games = 0.333... win rate
      expect(stats.standings.find(p => p.name === 'Alice')?.winRate).toBeCloseTo(1/3)
      // Bob: 2 wins, 1 draw / 3 games = 0.666... win rate
      expect(stats.standings.find(p => p.name === 'Bob')?.winRate).toBeCloseTo(2/3)
      // Charlie: 0 wins, 1 draw, 2 losses / 3 games = 0 win rate
      expect(stats.standings.find(p => p.name === 'Charlie')?.winRate).toBe(0)
      // Diana: 1 win, 1 draw, 1 loss / 3 games = 0.333... win rate
      expect(stats.standings.find(p => p.name === 'Diana')?.winRate).toBeCloseTo(1/3)
    })

    it('sorts by pointsPerGame first (Option 1 implementation)', () => {
      const tournament = createBaseTournament({
        pointsPerGame: 24,
        numberOfCourts: 1,
        players: [
          { name: 'Alice' },  
          { name: 'Bob' },    // Will have best PPG
          { name: 'Charlie' },
          { name: 'Diana' },
        ],
        matches: [
          createMatch([0, 1], [2, 3], true, 0, 8),  // Alice & Bob win 16-8
          createMatch([1, 2], [0, 3], true, 0, 8),  // Bob & Charlie win 16-8 over Alice & Diana
          createMatch([1, 3], [0, 2], true, 0, 8),  // Bob & Diana win 16-8 over Alice & Charlie
        ],
      })
      const stats = getTournamentStats(tournament)

      // Bob: 48 points / 3 games = 16 PPG (best, 3 wins)
      expect(stats.standings[0].name).toBe('Bob')
      expect(stats.standings[0].pointsPerGame).toBe(16)
      expect(stats.standings[0].wins).toBe(3)
      
      // Alice, Charlie, Diana all have 32 points / 3 games = 10.67 PPG
      // Alice: 1 win, 2 losses = 0.333 win rate
      // Charlie: 1 win, 2 losses = 0.333 win rate
      // Diana: 1 win, 2 losses = 0.333 win rate
      // All tie on PPG, win rate, total points, total wins -> alphabetically
      expect(stats.standings[1].name).toBe('Alice')
      expect(stats.standings[1].pointsPerGame).toBeCloseTo(10.67, 1)
      
      expect(stats.standings[2].name).toBe('Charlie')
      expect(stats.standings[2].pointsPerGame).toBeCloseTo(10.67, 1)
      
      expect(stats.standings[3].name).toBe('Diana')
      expect(stats.standings[3].pointsPerGame).toBeCloseTo(10.67, 1)
    })

    it('uses winRate as tiebreaker when PPG is equal', () => {
      const tournament = createBaseTournament({
        pointsPerGame: 32,
        matches: [
          createMatch([0, 1], [2, 3], true, 0, 0),  // Draw: all get 16 points
          createMatch([0, 2], [1, 3], true, 0, 8),  // Alice & Charlie win 20-12 over Bob & Diana
        ],
      })
      const stats = getTournamentStats(tournament)

      // Alice and Charlie both have 36 points / 2 games = 18 PPG, 0.5 win rate
      // Bob and Diana both have 28 points / 2 games = 14 PPG, 0 win rate
      
      // Alice and Charlie should be first two (18 PPG, 0.5 win rate), alphabetically
      expect(stats.standings[0].name).toBe('Alice')
      expect(stats.standings[0].pointsPerGame).toBe(18)
      expect(stats.standings[0].winRate).toBe(0.5)
      
      expect(stats.standings[1].name).toBe('Charlie')
      expect(stats.standings[1].pointsPerGame).toBe(18)
      expect(stats.standings[1].winRate).toBe(0.5)
      
      // Bob and Diana next (14 PPG, 0 win rate), alphabetically  
      expect(stats.standings[2].name).toBe('Bob')
      expect(stats.standings[2].pointsPerGame).toBe(14)
      expect(stats.standings[2].winRate).toBe(0)
      
      expect(stats.standings[3].name).toBe('Diana')
      expect(stats.standings[3].pointsPerGame).toBe(14)
      expect(stats.standings[3].winRate).toBe(0)
    })

    it('handles players with different games played (uneven participation)', () => {
      const tournament = createBaseTournament({
        pointsPerGame: 24,
        numberOfCourts: 1,
        playerCount: 5,
        players: [
          { name: 'Alice' },  // Plays 2 games
          { name: 'Bob' },    // Plays 2 games
          { name: 'Charlie' },// Plays 2 games
          { name: 'Diana' },  // Plays 2 games
          { name: 'Eve' },    // Plays 0 games (sits out both rounds)
        ],
        matches: [
          createMatch([0, 1], [2, 3], true, 0, 4),  // Alice & Bob win 14-10
          createMatch([0, 2], [1, 3], true, 0, 4),  // Alice & Charlie win 14-10
        ],
      })
      const stats = getTournamentStats(tournament)

      // Alice: 28 pts / 2 games = 14 PPG, 2 wins = 1.0 win rate (best)
      expect(stats.standings[0].name).toBe('Alice')
      expect(stats.standings[0].gamesPlayed).toBe(2)
      expect(stats.standings[0].gamesSitting).toBe(0)
      expect(stats.standings[0].pointsPerGame).toBe(14)
      expect(stats.standings[0].winRate).toBe(1.0)
      
      // Eve: 0 games played, should be last with 0 PPG
      expect(stats.standings[4].name).toBe('Eve')
      expect(stats.standings[4].gamesPlayed).toBe(0)
      expect(stats.standings[4].gamesSitting).toBe(2)
      expect(stats.standings[4].pointsPerGame).toBe(0)
      expect(stats.standings[4].winRate).toBe(0)
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
          createMatch([0, 1], [2, 3], true, 0, 4), // Winners: 10, Losers: 6
        ],
      })
      const stats = getTournamentStats(tournament)

      expect(stats.standings.find(p => p.name === 'Alice')?.points).toBe(10)
      expect(stats.standings.find(p => p.name === 'Charlie')?.points).toBe(6)
    })

    it('calculates correctly with 32 points per game', () => {
      const tournament = createBaseTournament({
        pointsPerGame: 32,
        matches: [
          createMatch([0, 1], [2, 3], true, 1, 8), // Winners (team2): 20, Losers (team1): 12
        ],
      })
      const stats = getTournamentStats(tournament)

      expect(stats.standings.find(p => p.name === 'Alice')?.points).toBe(12)
      expect(stats.standings.find(p => p.name === 'Charlie')?.points).toBe(20)
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
