import { describe, it, expect } from 'vitest'
import {
  getPartnershipStats,
  getMatchSuperlatives,
  getStandingsProgression,
  getPlayerConsistency,
} from '../tournamentInsights'
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

describe('getPartnershipStats', () => {
  it('returns empty array when no matches exist', () => {
    const tournament = createBaseTournament()
    const partnerships = getPartnershipStats(tournament)

    expect(partnerships).toEqual([])
  })

  it('calculates partnership stats for finished matches', () => {
    const tournament = createBaseTournament({
      matches: [
        createMatch([0, 1], [2, 3], true, 0, 4), // Alice & Bob win vs Charlie & Diana
        createMatch([0, 1], [2, 3], true, 0, 2), // Alice & Bob win again vs Charlie & Diana
        createMatch([0, 2], [1, 3], true, 1, 6), // Bob & Diana win vs Alice & Charlie
      ],
    })

    const partnerships = getPartnershipStats(tournament)

    // Should have 4 unique partnerships: 0-1, 2-3, 0-2, 1-3
    expect(partnerships).toHaveLength(4)

    // Alice & Bob partnership (indices 0-1)
    const aliceBob = partnerships.find(p => p.player1Index === 0 && p.player2Index === 1)
    expect(aliceBob).toBeDefined()
    expect(aliceBob?.gamesPlayed).toBe(2)
    expect(aliceBob?.wins).toBe(2)
    expect(aliceBob?.losses).toBe(0)
    expect(aliceBob?.winRate).toBe(1.0)
  })

  it('sorts partnerships by win rate then games played', () => {
    const tournament = createBaseTournament({
      matches: [
        createMatch([0, 1], [2, 3], true, 0, 4), // Alice & Bob: 1 win
        createMatch([0, 2], [1, 3], true, 0, 2), // Alice & Charlie: 1 win
        createMatch([0, 2], [1, 3], true, 0, 2), // Alice & Charlie: 2 wins
        createMatch([0, 1], [2, 3], true, 1, 6), // Charlie & Diana: 1 win
      ],
    })

    const partnerships = getPartnershipStats(tournament)

    // Alice & Charlie should be first (2 games, 100% win rate)
    expect(partnerships[0].player1Index).toBe(0)
    expect(partnerships[0].player2Index).toBe(2)
    expect(partnerships[0].gamesPlayed).toBe(2)
    expect(partnerships[0].winRate).toBe(1.0)
  })

  it('handles draws correctly', () => {
    const tournament = createBaseTournament({
      matches: [
        createMatch([0, 1], [2, 3], true, 0, 0), // Draw
      ],
    })

    const partnerships = getPartnershipStats(tournament)

    expect(partnerships).toHaveLength(2)
    const aliceBob = partnerships.find(p => p.player1Index === 0 && p.player2Index === 1)
    expect(aliceBob?.draws).toBe(1)
    expect(aliceBob?.wins).toBe(0)
    expect(aliceBob?.losses).toBe(0)
  })

  it('ignores unfinished matches', () => {
    const tournament = createBaseTournament({
      matches: [
        createMatch([0, 1], [2, 3], false), // Unfinished
        createMatch([0, 1], [2, 3], true, 0, 4), // Finished
      ],
    })

    const partnerships = getPartnershipStats(tournament)

    const aliceBob = partnerships.find(p => p.player1Index === 0 && p.player2Index === 1)
    expect(aliceBob?.gamesPlayed).toBe(1) // Only counts finished match
  })
})

describe('getMatchSuperlatives', () => {
  it('returns empty object when no finished matches exist', () => {
    const tournament = createBaseTournament()
    const superlatives = getMatchSuperlatives(tournament)

    expect(superlatives).toEqual({})
  })

  it('finds closest match with smallest non-zero scoreDelta', () => {
    const tournament = createBaseTournament({
      matches: [
        createMatch([0, 1], [2, 3], true, 0, 8), // Delta 8
        createMatch([0, 2], [1, 3], true, 0, 2), // Delta 2 (closest)
        createMatch([0, 3], [1, 2], true, 1, 6), // Delta 6
      ],
    })

    const superlatives = getMatchSuperlatives(tournament)

    expect(superlatives.closestMatch).toBeDefined()
    expect(superlatives.closestMatch?.scoreDelta).toBe(2)
    expect(superlatives.closestMatch?.roundNumber).toBe(1)
  })

  it('finds biggest blowout with largest scoreDelta', () => {
    const tournament = createBaseTournament({
      matches: [
        createMatch([0, 1], [2, 3], true, 0, 2), // Delta 2
        createMatch([0, 2], [1, 3], true, 0, 12), // Delta 12 (biggest)
        createMatch([0, 3], [1, 2], true, 1, 6), // Delta 6
      ],
    })

    const superlatives = getMatchSuperlatives(tournament)

    expect(superlatives.biggestBlowout).toBeDefined()
    expect(superlatives.biggestBlowout?.scoreDelta).toBe(12)
  })

  it('finds highest scoring match', () => {
    const tournament = createBaseTournament({
      pointsPerGame: 32,
      matches: [
        createMatch([0, 1], [2, 3], true, 0, 2), // 17-15 = 32 total
        createMatch([0, 2], [1, 3], true, 0, 0), // 16-16 = 32 total (draw, same)
        createMatch([0, 3], [1, 2], true, 1, 4), // 18-14 = 32 total (same)
      ],
    })

    const superlatives = getMatchSuperlatives(tournament)

    // All matches have same total - should return one of them
    expect(superlatives.highestScoring).toBeDefined()
    const total = (superlatives.highestScoring?.score1 ?? 0) + (superlatives.highestScoring?.score2 ?? 0)
    expect(total).toBe(32)
  })

  it('excludes draws from closest match', () => {
    const tournament = createBaseTournament({
      matches: [
        createMatch([0, 1], [2, 3], true, 0, 0), // Draw (delta 0)
        createMatch([0, 2], [1, 3], true, 0, 4), // Delta 4 (closest non-draw)
      ],
    })

    const superlatives = getMatchSuperlatives(tournament)

    expect(superlatives.closestMatch?.scoreDelta).toBe(4)
  })

  it('calculates correct scores from winner and scoreDelta', () => {
    const tournament = createBaseTournament({
      pointsPerGame: 24,
      matches: [
        createMatch([0, 1], [2, 3], true, 0, 8), // Winner team1, delta 8 -> 16-8
      ],
    })

    const superlatives = getMatchSuperlatives(tournament)

    expect(superlatives.closestMatch?.score1).toBe(16)
    expect(superlatives.closestMatch?.score2).toBe(8)
  })
})

describe('getStandingsProgression', () => {
  it('returns empty rounds when no matches exist', () => {
    const tournament = createBaseTournament()
    const progression = getStandingsProgression(tournament)

    expect(progression.rounds).toEqual([])
  })

  it('calculates standings after each completed round', () => {
    const tournament = createBaseTournament({
      numberOfCourts: 2,
      matches: [
        // Round 1
        createMatch([0, 1], [2, 3], true, 0, 4), // Alice & Bob win 14-10
        createMatch([0, 2], [1, 3], true, 0, 2), // Alice & Charlie win 13-11
      ],
    })

    const progression = getStandingsProgression(tournament)

    expect(progression.rounds).toEqual([1])
    
    // Alice should have played 2 games
    const aliceProgression = progression.playerProgressions.get(0)
    expect(aliceProgression).toHaveLength(1)
    expect(aliceProgression?.[0].gamesPlayed).toBe(2)
    expect(aliceProgression?.[0].points).toBe(27) // 14 + 13
  })

  it('stops at first incomplete round', () => {
    const tournament = createBaseTournament({
      numberOfCourts: 2,
      matches: [
        // Round 1 (complete)
        createMatch([0, 1], [2, 3], true, 0, 4),
        createMatch([0, 2], [1, 3], true, 0, 2),
        // Round 2 (incomplete)
        createMatch([0, 1], [2, 3], true, 0, 4),
        createMatch([0, 2], [1, 3], false), // Not finished
      ],
    })

    const progression = getStandingsProgression(tournament)

    expect(progression.rounds).toEqual([1]) // Only round 1 is complete
  })

  it('tracks rank changes across rounds', () => {
    const tournament = createBaseTournament({
      numberOfCourts: 1,
      matches: [
        // Round 1: Alice & Bob win big
        createMatch([0, 1], [2, 3], true, 0, 8),
        // Round 2: Charlie & Diana win big
        createMatch([2, 3], [0, 1], true, 0, 8),
      ],
    })

    const progression = getStandingsProgression(tournament)

    expect(progression.rounds).toEqual([1, 2])

    // After round 1, Alice should be ranked higher (more points)
    const aliceRound1 = progression.playerProgressions.get(0)?.[0]
    expect(aliceRound1?.points).toBe(16)

    // After round 2, Alice gets fewer points
    const aliceRound2 = progression.playerProgressions.get(0)?.[1]
    expect(aliceRound2?.points).toBe(24) // 16 + 8
  })
})

describe('getPlayerConsistency', () => {
  it('returns empty array when no finished matches exist', () => {
    const tournament = createBaseTournament()
    const consistency = getPlayerConsistency(tournament)

    expect(consistency).toEqual([])
  })

  it('calculates score variance and standard deviation', () => {
    const tournament = createBaseTournament({
      pointsPerGame: 24,
      matches: [
        createMatch([0, 1], [2, 3], true, 0, 0), // Alice gets 12 (draw)
        createMatch([0, 2], [1, 3], true, 0, 8), // Alice gets 16
        createMatch([0, 3], [1, 2], true, 1, 8), // Alice gets 8
      ],
    })

    const consistency = getPlayerConsistency(tournament)

    const alice = consistency.find(c => c.playerIndex === 0)
    expect(alice).toBeDefined()
    expect(alice?.gamesPlayed).toBe(3)
    expect(alice?.averageScore).toBe(12) // (12 + 16 + 8) / 3
    expect(alice?.minScore).toBe(8)
    expect(alice?.maxScore).toBe(16)
    expect(alice?.scoreRange).toBe(8)
    
    // Variance should be calculated correctly
    // Scores: 12, 16, 8; Mean: 12
    // Squared diffs: 0, 16, 16; Variance: 32/3 ≈ 10.67
    expect(alice?.scoreVariance).toBeCloseTo(10.67, 1)
    expect(alice?.scoreStdDev).toBeCloseTo(3.27, 1)
  })

  it('sorts players by variance (ascending)', () => {
    const tournament = createBaseTournament({
      pointsPerGame: 24,
      numberOfCourts: 1,
      playerCount: 8,
      players: [
        { name: 'Alice' },
        { name: 'Bob' },
        { name: 'Charlie' },
        { name: 'Diana' },
        { name: 'Eve' },
        { name: 'Frank' },
        { name: 'Grace' },
        { name: 'Henry' },
      ],
      matches: [
        // Alice: very consistent (gets 12 three times) - plays with Bob
        createMatch([0, 1], [4, 5], true, undefined, 0), // Alice gets 12 (draw)
        createMatch([0, 1], [6, 7], true, undefined, 0), // Alice gets 12 (draw)
        createMatch([0, 1], [4, 6], true, undefined, 0), // Alice gets 12 (draw)
        // Charlie: high variance - plays with Diana
        createMatch([2, 3], [4, 5], true, 0, 16), // Charlie gets 20
        createMatch([2, 3], [6, 7], true, 0, 16), // Charlie gets 20
        createMatch([2, 3], [4, 6], true, 1, 16), // Charlie gets 4
      ],
    })

    const consistency = getPlayerConsistency(tournament)

    // Alice should have very low variance (all 12s)
    const alice = consistency.find(c => c.playerIndex === 0)
    const charlie = consistency.find(c => c.playerIndex === 2)
    
    expect(alice?.scoreVariance).toBeLessThan(1) // Nearly 0
    expect(charlie?.scoreVariance).toBeGreaterThan(50) // High variance (20, 20, 4)
    
    // First player should have lower variance than last
    expect(consistency[0].scoreVariance).toBeLessThan(consistency[consistency.length - 1].scoreVariance)
  })

  it('ignores unfinished matches', () => {
    const tournament = createBaseTournament({
      matches: [
        createMatch([0, 1], [2, 3], true, 0, 4),
        createMatch([0, 1], [2, 3], false), // Unfinished
      ],
    })

    const consistency = getPlayerConsistency(tournament)

    const alice = consistency.find(c => c.playerIndex === 0)
    expect(alice?.gamesPlayed).toBe(1) // Only finished match
  })

  it('handles players with no finished matches', () => {
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
        createMatch([0, 1], [2, 3], true, 0, 4), // Eve and Frank don't play
      ],
    })

    const consistency = getPlayerConsistency(tournament)

    // Eve and Frank should not be in the results (no games played)
    expect(consistency.length).toBe(4) // Only Alice, Bob, Charlie, Diana
    expect(consistency.find(c => c.playerIndex === 4)).toBeUndefined()
    expect(consistency.find(c => c.playerIndex === 5)).toBeUndefined()
  })
})
