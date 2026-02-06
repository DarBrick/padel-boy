import type { StoredTournament, StoredMatch } from '../schemas/tournament'
import { getTournamentStats } from './tournamentStats'

/**
 * Generates the next round of matches for a Mexicano tournament.
 * 
 * Supports:
 * - Random pairings for initial rounds (based on mexicanoRandomRounds config)
 * - Ranking-based pairings after random phase completes
 * - Fair player rotation when player count not divisible by 4
 * - Two matchup styles: '1&4vs2&3' and '1&3vs2&4'
 * 
 * @param tournament - The tournament to generate a round for
 * @returns Array of matches for the next round, ready to append to tournament.matches
 */
export function generateNextRound(tournament: StoredTournament): StoredMatch[] {
  // Validate tournament format
  if (tournament.format !== 'mexicano') {
    console.error('Round generation only supported for Mexicano format')
    return []
  }

  // Validate minimum players
  if (tournament.playerCount < 4) {
    console.error('Need at least 4 players to generate a round')
    return []
  }

  // Get tournament statistics to determine current phase
  const stats = getTournamentStats(tournament)
  const { completedRounds } = stats

  // Determine pairing strategy based on completed rounds
  const randomRounds = tournament.mexicanoRandomRounds ?? 2
  const useRandomPairing = completedRounds < randomRounds

  // Calculate sit-out distribution and select who sits this round
  const sitOutCounts = calculateSitOutCounts(tournament)
  const sittingPlayerIndices = selectSittingPlayers(tournament, sitOutCounts)
  
  // Create list of active players (not sitting out)
  const activePlayerIndices = Array.from(
    { length: tournament.playerCount }, 
    (_, i) => i
  ).filter(i => !sittingPlayerIndices.includes(i))

  // Generate matches based on strategy
  if (useRandomPairing) {
    return generateRandomPairings(activePlayerIndices, tournament.numberOfCourts)
  } else {
    return generateRankingBasedPairings(tournament, activePlayerIndices)
  }
}

/**
 * Counts how many times each player has sat out in previous rounds.
 * 
 * @param tournament - The tournament to analyze
 * @returns Array of sit-out counts indexed by player index
 */
export function calculateSitOutCounts(tournament: StoredTournament): number[] {
  const sitOutCounts = new Array(tournament.playerCount).fill(0)
  
  // If no matches yet, everyone has sat out zero times
  if (tournament.matches.length === 0) {
    return sitOutCounts
  }

  const matchesPerRound = tournament.numberOfCourts
  const totalRounds = Math.ceil(tournament.matches.length / matchesPerRound)

  // For each round, determine which players participated
  for (let roundIndex = 0; roundIndex < totalRounds; roundIndex++) {
    const roundStart = roundIndex * matchesPerRound
    const roundEnd = Math.min(roundStart + matchesPerRound, tournament.matches.length)
    const roundMatches = tournament.matches.slice(roundStart, roundEnd)

    // Collect all player indices who played in this round
    const playersInRound = new Set<number>()
    for (const match of roundMatches) {
      playersInRound.add(match.team1[0])
      playersInRound.add(match.team1[1])
      playersInRound.add(match.team2[0])
      playersInRound.add(match.team2[1])
    }

    // Increment sit-out count for players who didn't play
    for (let playerIndex = 0; playerIndex < tournament.playerCount; playerIndex++) {
      if (!playersInRound.has(playerIndex)) {
        sitOutCounts[playerIndex]++
      }
    }
  }

  return sitOutCounts
}

/**
 * Selects which players should sit out this round based on fairness.
 * Players with fewest sit-outs are prioritized, then randomized.
 * 
 * @param tournament - The tournament configuration
 * @param sitOutCounts - Current sit-out counts per player
 * @returns Array of player indices who should sit out this round
 */
export function selectSittingPlayers(
  tournament: StoredTournament,
  sitOutCounts: number[]
): number[] {
  const playersNeeded = Math.floor(tournament.playerCount / 4) * 4
  const sittersThisRound = tournament.playerCount - playersNeeded

  // If everyone plays, no one sits
  if (sittersThisRound === 0) {
    return []
  }

  // Find players with minimum sit-out count
  const minSitOutCount = Math.min(...sitOutCounts)
  const candidates = sitOutCounts
    .map((count, index) => ({ index, count }))
    .filter(({ count }) => count === minSitOutCount)
    .map(({ index }) => index)

  // Shuffle candidates and take the required number
  const shuffled = shuffleArray([...candidates])
  return shuffled.slice(0, sittersThisRound)
}

/**
 * Generates matches using random pairings.
 * Used during the initial random rounds phase.
 * 
 * @param activePlayerIndices - Player indices participating this round
 * @param numberOfCourts - Maximum number of courts available
 * @returns Array of matches with random pairings
 */
export function generateRandomPairings(
  activePlayerIndices: number[],
  numberOfCourts: number
): StoredMatch[] {
  // Shuffle players randomly
  const shuffled = shuffleArray([...activePlayerIndices])
  
  const matches: StoredMatch[] = []
  const maxMatches = Math.min(numberOfCourts, Math.floor(shuffled.length / 4))

  // Group shuffled players into teams of 2, matches of 4
  for (let i = 0; i < maxMatches; i++) {
    const baseIndex = i * 4
    matches.push({
      team1: [shuffled[baseIndex], shuffled[baseIndex + 1]],
      team2: [shuffled[baseIndex + 2], shuffled[baseIndex + 3]],
      isFinished: false,
    })
  }

  return matches
}

/**
 * Generates matches using ranking-based pairings.
 * Used after random rounds complete, pairs players by current standings.
 * 
 * @param tournament - The tournament with current standings
 * @param activePlayerIndices - Player indices participating this round
 * @returns Array of matches with ranking-based pairings
 */
export function generateRankingBasedPairings(
  tournament: StoredTournament,
  activePlayerIndices: number[]
): StoredMatch[] {
  // Get current standings
  const stats = getTournamentStats(tournament)
  const { standings } = stats

  // Filter standings to only active players and extract sorted indices
  const activeSet = new Set(activePlayerIndices)
  const sortedIndices = standings
    .filter(player => activeSet.has(player.index))
    .map(player => player.index)

  const matches: StoredMatch[] = []
  const maxMatches = Math.min(tournament.numberOfCourts, Math.floor(sortedIndices.length / 4))
  const matchupStyle = tournament.mexicanoMatchupStyle ?? '1&4vs2&3'

  // Generate pairings based on matchup style
  for (let i = 0; i < maxMatches; i++) {
    const baseIndex = i * 4
    
    if (matchupStyle === '1&4vs2&3') {
      // Partners: 1st & 4th vs 2nd & 3rd
      // Pattern: [0,3] vs [1,2], [4,7] vs [5,6], ...
      matches.push({
        team1: [sortedIndices[baseIndex], sortedIndices[baseIndex + 3]],
        team2: [sortedIndices[baseIndex + 1], sortedIndices[baseIndex + 2]],
        isFinished: false,
      })
    } else {
      // matchupStyle === '1&3vs2&4'
      // Partners: 1st & 3rd vs 2nd & 4th
      // Pattern: [0,2] vs [1,3], [4,6] vs [5,7], ...
      matches.push({
        team1: [sortedIndices[baseIndex], sortedIndices[baseIndex + 2]],
        team2: [sortedIndices[baseIndex + 1], sortedIndices[baseIndex + 3]],
        isFinished: false,
      })
    }
  }

  return matches
}

/**
 * Fisher-Yates shuffle algorithm for array randomization.
 * 
 * @param array - Array to shuffle (mutated in place)
 * @returns The shuffled array
 */
function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}
