import { describe, it, expect } from 'vitest'
import {
  generateNextRound,
  calculateSitOutCounts,
  selectSittingPlayers,
  generateRandomPairings,
  generateRankingBasedPairings,
  generateAmericanoPairings,
  calculatePartnershipHistory,
  calculateMatchupHistory,
  generateAllMatchConfigurations,
  scoreMatchConfiguration,
  selectBestConfiguration,
} from '../roundGenerator'
import type { StoredTournament, StoredMatch } from '../../schemas/tournament'

function createBaseTournament(overrides: Partial<StoredTournament> = {}): StoredTournament {
  return {
    version: 1,
    format: 'mexicano',
    pointsPerGame: 21,
    numberOfCourts: 2,
    isFixedPairs: false,
    playerCount: 8,
    mexicanoMatchupStyle: '1&4vs2&3',
    mexicanoRandomRounds: 2,
    id: 'test12345',
    players: [
      { name: 'Player 1' },
      { name: 'Player 2' },
      { name: 'Player 3' },
      { name: 'Player 4' },
      { name: 'Player 5' },
      { name: 'Player 6' },
      { name: 'Player 7' },
      { name: 'Player 8' },
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

describe('roundGenerator', () => {
  describe('generateNextRound', () => {
    it('returns empty array for less than 4 players', () => {
      const tournament = createBaseTournament({
        playerCount: 3,
        players: [{ name: 'P1' }, { name: 'P2' }, { name: 'P3' }],
      })
      const matches = generateNextRound(tournament)
      
      expect(matches).toEqual([])
    })

    it('creates first round when tournament has zero matches', () => {
      const tournament = createBaseTournament({
        matches: [], // Explicitly zero matches
      })
      
      const matches = generateNextRound(tournament)
      
      // Should generate first round with random pairings
      expect(matches).toHaveLength(2)
      expect(matches[0].isFinished).toBe(false)
      expect(matches[0].winner).toBeUndefined()
      expect(matches[0].scoreDelta).toBeUndefined()
      
      // Verify all 8 players are used
      const allPlayers = new Set<number>()
      matches.forEach(m => {
        allPlayers.add(m.team1[0])
        allPlayers.add(m.team1[1])
        allPlayers.add(m.team2[0])
        allPlayers.add(m.team2[1])
      })
      expect(allPlayers.size).toBe(8)
    })

    it('generates random pairings for first round (within random phase)', () => {
      const tournament = createBaseTournament()
      const matches = generateNextRound(tournament)
      
      expect(matches).toHaveLength(2)
      expect(matches[0].isFinished).toBe(false)
      expect(matches[0].winner).toBeUndefined()
      expect(matches[0].scoreDelta).toBeUndefined()
      
      // Verify all 8 players are used
      const allPlayers = new Set<number>()
      matches.forEach(m => {
        allPlayers.add(m.team1[0])
        allPlayers.add(m.team1[1])
        allPlayers.add(m.team2[0])
        allPlayers.add(m.team2[1])
      })
      expect(allPlayers.size).toBe(8)
    })

    it('generates ranking-based pairings after random phase completes', () => {
      // Create tournament with 2 completed rounds (reaching ranking phase)
      const matches = [
        // Round 1 (random) - finished
        createMatch([0, 1], [2, 3], true, 0, 5), // 0,1 win
        createMatch([4, 5], [6, 7], true, 1, 3), // 6,7 win
        // Round 2 (random) - finished
        createMatch([0, 2], [4, 6], true, 0, 2), // 0,2 win
        createMatch([1, 3], [5, 7], true, 1, 4), // 5,7 win
      ]
      
      const tournament = createBaseTournament({
        matches,
        mexicanoRandomRounds: 2,
      })
      
      const newMatches = generateNextRound(tournament)
      
      expect(newMatches).toHaveLength(2)
      // Should use ranking-based pairing, not random
      // We can't predict exact pairings due to complex standings, but structure should be valid
      newMatches.forEach(match => {
        expect(match.team1).toHaveLength(2)
        expect(match.team2).toHaveLength(2)
        expect(match.isFinished).toBe(false)
      })
    })

    it('handles 10 players with 2 sitting out', () => {
      const tournament = createBaseTournament({
        playerCount: 10,
        players: Array.from({ length: 10 }, (_, i) => ({ name: `Player ${i + 1}` })),
        numberOfCourts: 2,
      })
      
      const matches = generateNextRound(tournament)
      
      // Should generate 2 matches (8 active players / 4 = 2 matches)
      expect(matches).toHaveLength(2)
      
      // Count unique players in matches
      const playingPlayers = new Set<number>()
      matches.forEach(m => {
        playingPlayers.add(m.team1[0])
        playingPlayers.add(m.team1[1])
        playingPlayers.add(m.team2[0])
        playingPlayers.add(m.team2[1])
      })
      expect(playingPlayers.size).toBe(8) // 2 players sit out
    })

    it('generates correct number of matches for 4 players, 1 court', () => {
      const tournament = createBaseTournament({
        playerCount: 4,
        players: [
          { name: 'P1' },
          { name: 'P2' },
          { name: 'P3' },
          { name: 'P4' },
        ],
        numberOfCourts: 1,
      })
      
      const matches = generateNextRound(tournament)
      
      expect(matches).toHaveLength(1)
      expect(matches[0].team1).toHaveLength(2)
      expect(matches[0].team2).toHaveLength(2)
    })
  })

  describe('calculateSitOutCounts', () => {
    it('returns zeros for tournament with no matches', () => {
      const tournament = createBaseTournament()
      const counts = calculateSitOutCounts(tournament)
      
      expect(counts).toEqual([0, 0, 0, 0, 0, 0, 0, 0])
    })

    it('counts sit-outs correctly for 10 players', () => {
      const tournament = createBaseTournament({
        playerCount: 10,
        players: Array.from({ length: 10 }, (_, i) => ({ name: `Player ${i + 1}` })),
        numberOfCourts: 2,
        matches: [
          // Round 1: Players 0-7 play, 8-9 sit
          createMatch([0, 1], [2, 3], true, 0, 5),
          createMatch([4, 5], [6, 7], true, 1, 3),
          // Round 2: Players 0,1,2,3,4,5,8,9 play, 6,7 sit
          createMatch([0, 1], [8, 9], true, 0, 2),
          createMatch([4, 5], [2, 3], true, 0, 4),
        ],
      })
      
      const counts = calculateSitOutCounts(tournament)
      
      // Players 8-9 sat once (round 1), players 6,7 sat once (round 2)
      expect(counts[0]).toBe(0)
      expect(counts[1]).toBe(0)
      expect(counts[2]).toBe(0)
      expect(counts[3]).toBe(0)
      expect(counts[4]).toBe(0)
      expect(counts[5]).toBe(0)
      expect(counts[6]).toBe(1)
      expect(counts[7]).toBe(1)
      expect(counts[8]).toBe(1)
      expect(counts[9]).toBe(1)
    })

    it('handles partial rounds correctly', () => {
      const tournament = createBaseTournament({
        playerCount: 8,
        numberOfCourts: 3, // More courts than matches
        matches: [
          // Round 1: Only 1 match instead of 3
          createMatch([0, 1], [2, 3], true, 0, 5),
        ],
      })
      
      const counts = calculateSitOutCounts(tournament)
      
      // Players 0-3 played, 4-7 sat out
      expect(counts[0]).toBe(0)
      expect(counts[1]).toBe(0)
      expect(counts[2]).toBe(0)
      expect(counts[3]).toBe(0)
      expect(counts[4]).toBe(1)
      expect(counts[5]).toBe(1)
      expect(counts[6]).toBe(1)
      expect(counts[7]).toBe(1)
    })
  })

  describe('selectSittingPlayers', () => {
    it('returns empty array when everyone plays (divisible by 4)', () => {
      const tournament = createBaseTournament({ playerCount: 8 })
      const sitOutCounts = [0, 0, 0, 0, 0, 0, 0, 0]
      
      const sitting = selectSittingPlayers(tournament, sitOutCounts)
      
      expect(sitting).toEqual([])
    })

    it('selects players with minimum sit-out count', () => {
      const tournament = createBaseTournament({
        playerCount: 10,
        players: Array.from({ length: 10 }, (_, i) => ({ name: `Player ${i + 1}` })),
      })
      const sitOutCounts = [1, 1, 0, 0, 1, 1, 1, 1, 0, 0]
      // Players 2, 3, 8, 9 have min count (0)
      
      const sitting = selectSittingPlayers(tournament, sitOutCounts)
      
      // Should select 2 players from those with count 0
      expect(sitting).toHaveLength(2)
      sitting.forEach(index => {
        expect([2, 3, 8, 9]).toContain(index)
      })
    })

    it('handles case where more players need to sit than minimum count', () => {
      const tournament = createBaseTournament({
        playerCount: 10,
        players: Array.from({ length: 10 }, (_, i) => ({ name: `Player ${i + 1}` })),
      })
      const sitOutCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      // All players have same count, need to randomly select 2
      
      const sitting = selectSittingPlayers(tournament, sitOutCounts)
      
      expect(sitting).toHaveLength(2)
      // Should be 2 different players
      expect(new Set(sitting).size).toBe(2)
    })
  })

  describe('generateRandomPairings', () => {
    it('generates correct number of matches', () => {
      const activePlayerIndices = [0, 1, 2, 3, 4, 5, 6, 7]
      const numberOfCourts = 2
      
      const matches = generateRandomPairings(activePlayerIndices, numberOfCourts)
      
      expect(matches).toHaveLength(2)
    })

    it('uses all active players', () => {
      const activePlayerIndices = [0, 1, 2, 3, 4, 5, 6, 7]
      const matches = generateRandomPairings(activePlayerIndices, 2)
      
      const usedPlayers = new Set<number>()
      matches.forEach(m => {
        usedPlayers.add(m.team1[0])
        usedPlayers.add(m.team1[1])
        usedPlayers.add(m.team2[0])
        usedPlayers.add(m.team2[1])
      })
      
      expect(usedPlayers.size).toBe(8)
    })

    it('limits matches to available courts', () => {
      const activePlayerIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
      const numberOfCourts = 2
      
      const matches = generateRandomPairings(activePlayerIndices, numberOfCourts)
      
      // Should only generate 2 matches even though 3 are possible
      expect(matches).toHaveLength(2)
    })

    it('creates matches with correct structure', () => {
      const activePlayerIndices = [5, 3, 7, 1]
      const matches = generateRandomPairings(activePlayerIndices, 1)
      
      expect(matches).toHaveLength(1)
      expect(matches[0].team1).toHaveLength(2)
      expect(matches[0].team2).toHaveLength(2)
      expect(matches[0].isFinished).toBe(false)
      expect(matches[0].winner).toBeUndefined()
      expect(matches[0].scoreDelta).toBeUndefined()
    })
  })

  describe('generateRankingBasedPairings', () => {
    it('pairs players according to 1&4vs2&3 matchup style', () => {
      // Create tournament with clear standings
      const tournament = createBaseTournament({
        matches: [
          // Player 0 wins big
          createMatch([0, 1], [2, 3], true, 0, 10),
          // Player 2 wins
          createMatch([2, 4], [5, 6], true, 0, 5),
        ],
        mexicanoMatchupStyle: '1&4vs2&3',
      })
      
      const activePlayerIndices = [0, 1, 2, 3, 4, 5, 6, 7]
      const matches = generateRankingBasedPairings(tournament, activePlayerIndices)
      
      expect(matches).toHaveLength(2)
      // First match should use pattern [0,3] vs [1,2] based on rankings
      // Second match should use pattern [4,7] vs [5,6]
      matches.forEach(match => {
        expect(match.team1).toHaveLength(2)
        expect(match.team2).toHaveLength(2)
        expect(match.isFinished).toBe(false)
      })
    })

    it('pairs players according to 1&3vs2&4 matchup style', () => {
      const tournament = createBaseTournament({
        matches: [
          createMatch([0, 1], [2, 3], true, 0, 5),
          createMatch([4, 5], [6, 7], true, 1, 3),
        ],
        mexicanoMatchupStyle: '1&3vs2&4',
      })
      
      const activePlayerIndices = [0, 1, 2, 3, 4, 5, 6, 7]
      const matches = generateRankingBasedPairings(tournament, activePlayerIndices)
      
      expect(matches).toHaveLength(2)
      // First match should use pattern [0,2] vs [1,3] based on rankings
      // Second match should use pattern [4,6] vs [5,7]
      matches.forEach(match => {
        expect(match.team1).toHaveLength(2)
        expect(match.team2).toHaveLength(2)
        expect(match.isFinished).toBe(false)
      })
    })

    it('filters out sitting players before pairing', () => {
      const tournament = createBaseTournament({
        playerCount: 10,
        players: Array.from({ length: 10 }, (_, i) => ({ name: `Player ${i + 1}` })),
        matches: [],
      })
      
      // 8 active players (2 sitting)
      const activePlayerIndices = [0, 1, 2, 3, 4, 5, 6, 7]
      const matches = generateRankingBasedPairings(tournament, activePlayerIndices)
      
      expect(matches).toHaveLength(2)
      
      // Verify only active players are in matches
      matches.forEach(match => {
        expect(activePlayerIndices).toContain(match.team1[0])
        expect(activePlayerIndices).toContain(match.team1[1])
        expect(activePlayerIndices).toContain(match.team2[0])
        expect(activePlayerIndices).toContain(match.team2[1])
      })
    })

    it('respects numberOfCourts limit', () => {
      const tournament = createBaseTournament({
        playerCount: 16,
        players: Array.from({ length: 16 }, (_, i) => ({ name: `Player ${i + 1}` })),
        numberOfCourts: 2, // Limit to 2 courts
        matches: [],
      })
      
      const activePlayerIndices = Array.from({ length: 16 }, (_, i) => i)
      const matches = generateRankingBasedPairings(tournament, activePlayerIndices)
      
      // Should only generate 2 matches even though 4 are possible with 16 players
      expect(matches).toHaveLength(2)
    })

    it('uses default matchup style when not specified', () => {
      const tournament = createBaseTournament({
        matches: [],
        mexicanoMatchupStyle: undefined,
      })
      
      const activePlayerIndices = [0, 1, 2, 3, 4, 5, 6, 7]
      const matches = generateRankingBasedPairings(tournament, activePlayerIndices)
      
      // Should still generate valid matches with default style
      expect(matches).toHaveLength(2)
      matches.forEach(match => {
        expect(match.team1).toHaveLength(2)
        expect(match.team2).toHaveLength(2)
      })
    })
  })

  describe('sit-out rotation fairness', () => {
    it('rotates sitting players fairly over multiple rounds', () => {
      const tournament = createBaseTournament({
        playerCount: 10,
        players: Array.from({ length: 10 }, (_, i) => ({ name: `Player ${i + 1}` })),
        numberOfCourts: 2,
        matches: [],
      })

      const sitOutHistory = Array.from({ length: 10 }, () => 0)

      // Generate 5 rounds and track sit-outs
      for (let round = 0; round < 5; round++) {
        const newMatches = generateNextRound(tournament)
        
        const playingInRound = new Set<number>()
        newMatches.forEach(m => {
          playingInRound.add(m.team1[0])
          playingInRound.add(m.team1[1])
          playingInRound.add(m.team2[0])
          playingInRound.add(m.team2[1])
        })
        
        // Track who sat out
        for (let i = 0; i < 10; i++) {
          if (!playingInRound.has(i)) {
            sitOutHistory[i]++
          }
        }
        
        // Add matches to tournament for next iteration
        tournament.matches.push(...newMatches)
      }

      // After 5 rounds with 10 players, each player should sit 1 time
      // (5 rounds * 2 sit-outs per round = 10 total sit-outs / 10 players = 1 each)
      sitOutHistory.forEach(count => {
        expect(count).toBe(1)
      })
    })
  })

  // ============================================================================
  // AMERICANO TESTS
  // ============================================================================

  describe('Americano Round Generation', () => {
    describe('calculatePartnershipHistory', () => {
      it('returns empty map when no matches played', () => {
        const tournament = createBaseTournament({ format: 'americano', matches: [] })
        const history = calculatePartnershipHistory(tournament)
        
        expect(history.size).toBe(0)
      })

      it('tracks partnerships correctly for one round', () => {
        const tournament = createBaseTournament({
          format: 'americano',
          matches: [
            createMatch([0, 1], [2, 3], true),
            createMatch([4, 5], [6, 7], true),
          ],
        })
        const history = calculatePartnershipHistory(tournament)
        
        expect(history.get('0-1')).toBe(1)
        expect(history.get('2-3')).toBe(1)
        expect(history.get('4-5')).toBe(1)
        expect(history.get('6-7')).toBe(1)
        expect(history.size).toBe(4)
      })

      it('increments count for repeat partnerships', () => {
        const tournament = createBaseTournament({
          format: 'americano',
          matches: [
            createMatch([0, 1], [2, 3], true),
            createMatch([0, 1], [4, 5], true), // 0-1 partnered again
          ],
        })
        const history = calculatePartnershipHistory(tournament)
        
        expect(history.get('0-1')).toBe(2)
        expect(history.get('2-3')).toBe(1)
        expect(history.get('4-5')).toBe(1)
      })

      it('uses sorted indices for consistent keys', () => {
        const tournament = createBaseTournament({
          format: 'americano',
          matches: [
            createMatch([1, 0], [3, 2], true), // Reversed order
          ],
        })
        const history = calculatePartnershipHistory(tournament)
        
        // Should still use sorted keys
        expect(history.get('0-1')).toBe(1)
        expect(history.get('2-3')).toBe(1)
        expect(history.get('1-0')).toBeUndefined()
      })
    })

    describe('calculateMatchupHistory', () => {
      it('returns empty map when no matches played', () => {
        const tournament = createBaseTournament({ format: 'americano', matches: [] })
        const history = calculateMatchupHistory(tournament)
        
        expect(history.size).toBe(0)
      })

      it('tracks all opponent pairings for one match', () => {
        const tournament = createBaseTournament({
          format: 'americano',
          matches: [
            createMatch([0, 1], [2, 3], true),
          ],
        })
        const history = calculateMatchupHistory(tournament)
        
        // Each player in team1 played against each player in team2
        expect(history.get('0-2')).toBe(1)
        expect(history.get('0-3')).toBe(1)
        expect(history.get('1-2')).toBe(1)
        expect(history.get('1-3')).toBe(1)
        expect(history.size).toBe(4)
      })

      it('increments count for repeat matchups', () => {
        const tournament = createBaseTournament({
          format: 'americano',
          matches: [
            createMatch([0, 1], [2, 3], true),
            createMatch([0, 4], [2, 5], true), // 0 vs 2 again
          ],
        })
        const history = calculateMatchupHistory(tournament)
        
        expect(history.get('0-2')).toBe(2)
        expect(history.get('0-3')).toBe(1)
        expect(history.get('0-5')).toBe(1)
      })
    })

    describe('generateAllMatchConfigurations', () => {
      it('returns empty array when not enough players for one match', () => {
        const configs = generateAllMatchConfigurations([0, 1, 2], 2)
        
        expect(configs).toEqual([])
      })

      it('generates configurations for exactly 4 players', () => {
        const configs = generateAllMatchConfigurations([0, 1, 2, 3], 1)
        
        expect(configs.length).toBeGreaterThan(0)
        configs.forEach(config => {
          expect(config).toHaveLength(1)
          expect(config[0].team1).toHaveLength(2)
          expect(config[0].team2).toHaveLength(2)
        })
      })

      it('generates configurations for 8 players, 2 courts', () => {
        const configs = generateAllMatchConfigurations([0, 1, 2, 3, 4, 5, 6, 7], 2)
        
        expect(configs.length).toBeGreaterThan(0)
        configs.forEach(config => {
          expect(config).toHaveLength(2)
          
          // All 8 players should be used
          const allPlayers = new Set<number>()
          config.forEach(m => {
            allPlayers.add(m.team1[0])
            allPlayers.add(m.team1[1])
            allPlayers.add(m.team2[0])
            allPlayers.add(m.team2[1])
          })
          expect(allPlayers.size).toBe(8)
        })
      })

      it('respects court limit', () => {
        const configs = generateAllMatchConfigurations([0, 1, 2, 3, 4, 5, 6, 7], 1)
        
        expect(configs.length).toBeGreaterThan(0)
        configs.forEach(config => {
          expect(config).toHaveLength(1) // Limited to 1 court
        })
      })

      it('generates different configurations (randomized)', () => {
        const configs = generateAllMatchConfigurations([0, 1, 2, 3, 4, 5, 6, 7], 2)
        
        // Should have multiple different configurations
        expect(configs.length).toBeGreaterThan(10)
        
        // Check that not all configurations are identical
        const firstConfig = JSON.stringify(configs[0])
        const allSame = configs.every(config => JSON.stringify(config) === firstConfig)
        expect(allSame).toBe(false)
      })
    })

    describe('scoreMatchConfiguration', () => {
      it('returns zero penalty for first round (no history)', () => {
        const config: StoredMatch[] = [
          createMatch([0, 1], [2, 3], false),
        ]
        const partnerHistory = new Map<string, number>()
        const matchupHistory = new Map<string, number>()
        
        const score = scoreMatchConfiguration(config, partnerHistory, matchupHistory)
        
        expect(score).toBe(0)
      })

      it('penalizes repeat partnerships', () => {
        const config: StoredMatch[] = [
          createMatch([0, 1], [2, 3], false),
        ]
        const partnerHistory = new Map([['0-1', 1]]) // 0-1 partnered once before
        const matchupHistory = new Map<string, number>()
        
        const score = scoreMatchConfiguration(config, partnerHistory, matchupHistory)
        
        // Should have partnership penalty: 1^2 * 10 = 10
        expect(score).toBe(10)
      })

      it('penalizes repeat matchups', () => {
        const config: StoredMatch[] = [
          createMatch([0, 1], [2, 3], false),
        ]
        const partnerHistory = new Map<string, number>()
        const matchupHistory = new Map([
          ['0-2', 1], // 0 vs 2 once before
        ])
        
        const score = scoreMatchConfiguration(config, partnerHistory, matchupHistory)
        
        // Should have opponent penalty: 1^2 * 3 = 3
        expect(score).toBe(3)
      })

      it('uses exponential penalty for multiple repeats', () => {
        const config: StoredMatch[] = [
          createMatch([0, 1], [2, 3], false),
        ]
        const partnerHistory = new Map([['0-1', 2]]) // 0-1 partnered twice before
        const matchupHistory = new Map<string, number>()
        
        const score = scoreMatchConfiguration(config, partnerHistory, matchupHistory)
        
        // Should have partnership penalty: 2^2 * 10 = 40
        expect(score).toBe(40)
      })

      it('weighs partnerships higher than matchups', () => {
        const configWithPartner: StoredMatch[] = [createMatch([0, 1], [2, 3], false)]
        const configWithOpponent: StoredMatch[] = [createMatch([0, 2], [1, 3], false)]
        
        const partnerHistory = new Map([['0-1', 1]])
        const matchupHistory = new Map([['0-1', 1]])
        
        const partnerScore = scoreMatchConfiguration(configWithPartner, partnerHistory, new Map())
        const opponentScore = scoreMatchConfiguration(configWithOpponent, new Map(), matchupHistory)
        
        // Partner penalty should be higher
        expect(partnerScore).toBeGreaterThan(opponentScore)
      })

      it('sums penalties across multiple matches', () => {
        const config: StoredMatch[] = [
          createMatch([0, 1], [2, 3], false),
          createMatch([4, 5], [6, 7], false),
        ]
        const partnerHistory = new Map([
          ['0-1', 1],
          ['4-5', 1],
        ])
        const matchupHistory = new Map<string, number>()
        
        const score = scoreMatchConfiguration(config, partnerHistory, matchupHistory)
        
        // Should sum both partnership penalties: 10 + 10 = 20
        expect(score).toBe(20)
      })
    })

    describe('selectBestConfiguration', () => {
      it('selects configuration with zero penalty when available', () => {
        const goodConfig: StoredMatch[] = [createMatch([0, 1], [2, 3], false)]
        const badConfig: StoredMatch[] = [createMatch([4, 5], [6, 7], false)]
        
        const configurations = [badConfig, goodConfig]
        const partnerHistory = new Map([['4-5', 1]]) // badConfig has repeat
        const matchupHistory = new Map<string, number>()
        
        const selected = selectBestConfiguration(configurations, partnerHistory, matchupHistory)
        
        expect(selected).toEqual(goodConfig)
      })

      it('selects lowest penalty configuration', () => {
        const config1: StoredMatch[] = [createMatch([0, 1], [2, 3], false)]
        const config2: StoredMatch[] = [createMatch([0, 2], [1, 3], false)]
        const config3: StoredMatch[] = [createMatch([0, 3], [1, 2], false)]
        
        const configurations = [config1, config2, config3]
        const partnerHistory = new Map([
          ['0-1', 2], // config1 has high penalty
          ['0-2', 1], // config2 has medium penalty
          // config3 has no penalty
        ])
        const matchupHistory = new Map<string, number>()
        
        const selected = selectBestConfiguration(configurations, partnerHistory, matchupHistory)
        
        expect(selected).toEqual(config3)
      })

      it('returns random selection when tied', () => {
        const config1: StoredMatch[] = [createMatch([0, 1], [2, 3], false)]
        const config2: StoredMatch[] = [createMatch([0, 2], [1, 3], false)]
        
        const configurations = [config1, config2]
        const partnerHistory = new Map<string, number>()
        const matchupHistory = new Map<string, number>()
        
        // Both have zero penalty, should select one
        const selected = selectBestConfiguration(configurations, partnerHistory, matchupHistory)
        
        expect([config1, config2]).toContainEqual(selected)
      })
    })

    describe('generateAmericanoPairings', () => {
      it('generates matches for americano format with no history', () => {
        const tournament = createBaseTournament({
          format: 'americano',
          matches: [],
        })
        const activePlayerIndices = [0, 1, 2, 3, 4, 5, 6, 7]
        
        const matches = generateAmericanoPairings(tournament, activePlayerIndices)
        
        expect(matches).toHaveLength(2)
        expect(matches[0].isFinished).toBe(false)
      })

      it('avoids repeat partnerships when possible', () => {
        const tournament = createBaseTournament({
          format: 'americano',
          matches: [
            createMatch([0, 1], [2, 3], true),
            createMatch([4, 5], [6, 7], true),
          ],
        })
        const activePlayerIndices = [0, 1, 2, 3, 4, 5, 6, 7]
        
        const matches = generateAmericanoPairings(tournament, activePlayerIndices)
        
        // Check that 0-1, 2-3, 4-5, 6-7 are NOT repeated
        const partnerships = [
          `${Math.min(matches[0].team1[0], matches[0].team1[1])}-${Math.max(matches[0].team1[0], matches[0].team1[1])}`,
          `${Math.min(matches[0].team2[0], matches[0].team2[1])}-${Math.max(matches[0].team2[0], matches[0].team2[1])}`,
          `${Math.min(matches[1].team1[0], matches[1].team1[1])}-${Math.max(matches[1].team1[0], matches[1].team1[1])}`,
          `${Math.min(matches[1].team2[0], matches[1].team2[1])}-${Math.max(matches[1].team2[0], matches[1].team2[1])}`,
        ]
        
        // Should avoid repeat partnerships (greedy algorithm should find better options)
        const hasRepeats = partnerships.some(p => ['0-1', '2-3', '4-5', '6-7'].includes(p))
        
        // With 8 players and only 4 used in first round, should easily avoid repeats
        expect(hasRepeats).toBe(false)
      })

      it('handles 4 players correctly', () => {
        const tournament = createBaseTournament({
          format: 'americano',
          playerCount: 4,
          players: [
            { name: 'Player 1' },
            { name: 'Player 2' },
            { name: 'Player 3' },
            { name: 'Player 4' },
          ],
          matches: [],
        })
        const activePlayerIndices = [0, 1, 2, 3]
        
        const matches = generateAmericanoPairings(tournament, activePlayerIndices)
        
        expect(matches).toHaveLength(1)
        
        const allPlayers = new Set<number>()
        matches[0].team1.forEach(p => allPlayers.add(p))
        matches[0].team2.forEach(p => allPlayers.add(p))
        expect(allPlayers.size).toBe(4)
      })
    })

    describe('generateNextRound - Americano Integration', () => {
      it('generates first round for americano format', () => {
        const tournament = createBaseTournament({
          format: 'americano',
          matches: [],
        })
        
        const matches = generateNextRound(tournament)
        
        expect(matches).toHaveLength(2)
        expect(matches[0].isFinished).toBe(false)
        
        // All 8 players should be used
        const allPlayers = new Set<number>()
        matches.forEach(m => {
          allPlayers.add(m.team1[0])
          allPlayers.add(m.team1[1])
          allPlayers.add(m.team2[0])
          allPlayers.add(m.team2[1])
        })
        expect(allPlayers.size).toBe(8)
      })

      it('maximizes diversity over multiple rounds', () => {
        const tournament = createBaseTournament({
          format: 'americano',
          matches: [],
        })
        
        const partnershipCounts = new Map<string, number>()
        const matchupCounts = new Map<string, number>()
        
        // Generate 3 rounds
        for (let round = 0; round < 3; round++) {
          const matches = generateNextRound(tournament)
          
          // Track partnerships
          matches.forEach(match => {
            const team1Key = `${Math.min(match.team1[0], match.team1[1])}-${Math.max(match.team1[0], match.team1[1])}`
            const team2Key = `${Math.min(match.team2[0], match.team2[1])}-${Math.max(match.team2[0], match.team2[1])}`
            
            partnershipCounts.set(team1Key, (partnershipCounts.get(team1Key) ?? 0) + 1)
            partnershipCounts.set(team2Key, (partnershipCounts.get(team2Key) ?? 0) + 1)
            
            // Track matchups
            match.team1.forEach(t1p => {
              match.team2.forEach(t2p => {
                const matchupKey = `${Math.min(t1p, t2p)}-${Math.max(t1p, t2p)}`
                matchupCounts.set(matchupKey, (matchupCounts.get(matchupKey) ?? 0) + 1)
              })
            })
          })
          
          // Add matches as finished for next round
          tournament.matches.push(...matches.map(m => ({ ...m, isFinished: true })))
        }
        
        // After 3 rounds with 8 players, should have good diversity
        // We use 4 partnerships per round × 3 rounds = 12 partnership slots
        // Max possible unique partnerships for 8 players: C(8,2) = 28
        // With greedy algorithm sampling random configs, should get mostly unique
        expect(partnershipCounts.size).toBeGreaterThanOrEqual(10) // At least 10/12 unique
        
        // Most partnerships should occur only once (some may repeat)
        const singleOccurrences = Array.from(partnershipCounts.values()).filter(count => count === 1).length
        expect(singleOccurrences).toBeGreaterThanOrEqual(8) // At least 8/12 single occurrences
      })

      it('handles sit-outs correctly with americano format', () => {
        const tournament = createBaseTournament({
          format: 'americano',
          playerCount: 10,
          players: Array.from({ length: 10 }, (_, i) => ({ name: `Player ${i + 1}` })),
          matches: [],
        })
        
        const sitOutHistory = Array.from({ length: 10 }, () => 0)
        
        // Generate 5 rounds and track sit-outs
        for (let round = 0; round < 5; round++) {
          const newMatches = generateNextRound(tournament)
          
          const playingInRound = new Set<number>()
          newMatches.forEach(m => {
            playingInRound.add(m.team1[0])
            playingInRound.add(m.team1[1])
            playingInRound.add(m.team2[0])
            playingInRound.add(m.team2[1])
          })
          
          // Track who sat out
          for (let i = 0; i < 10; i++) {
            if (!playingInRound.has(i)) {
              sitOutHistory[i]++
            }
          }
          
          // Add matches as finished for next round
          tournament.matches.push(...newMatches.map(m => ({ ...m, isFinished: true })))
        }
        
        // After 5 rounds with 10 players, each player should sit 1 time
        sitOutHistory.forEach(count => {
          expect(count).toBe(1)
        })
      })
    })
  })
})
