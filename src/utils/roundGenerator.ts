import type { StoredTournament, StoredMatch } from '../schemas/tournament'
import { getTournamentStats } from './tournamentStats'

/**
 * Generates the next round of matches for a tournament.
 * 
 * Mexicano format:
 * - Random pairings for initial rounds (based on mexicanoRandomRounds config)
 * - Ranking-based pairings after random phase completes
 * - Fair player rotation when player count not divisible by 4
 * - Two matchup styles: '1&4vs2&3' and '1&3vs2&4'
 * 
 * Americano format:
 * - Maximizes player diversity (partners and opponents)
 * - Greedy pairing algorithm based on history
 * - Prioritizes avoiding repeat partnerships over repeat opponents
 * 
 * @param tournament - The tournament to generate a round for
 * @returns Array of matches for the next round, ready to append to tournament.matches
 */
export function generateNextRound(tournament: StoredTournament): StoredMatch[] {
  // Validate minimum players
  if (tournament.playerCount < 4) {
    console.error('Need at least 4 players to generate a round')
    return []
  }

  // Calculate sit-out distribution and select who sits this round
  const sitOutCounts = calculateSitOutCounts(tournament)
  const sittingPlayerIndices = selectSittingPlayers(tournament, sitOutCounts)
  
  // Create list of active players (not sitting out)
  const activePlayerIndices = Array.from(
    { length: tournament.playerCount }, 
    (_, i) => i
  ).filter(i => !sittingPlayerIndices.includes(i))

  // For first round (no matches yet), use random pairings for both formats
  if (tournament.matches.length === 0) {
    return generateRandomPairings(activePlayerIndices, tournament.numberOfCourts)
  }

  // Generate matches based on tournament format
  if (tournament.format === 'americano') {
    return generateAmericanoPairings(tournament, activePlayerIndices)
  } else if (tournament.format === 'mexicano') {
    // Get tournament statistics to determine current phase
    const stats = getTournamentStats(tournament)
    const { completedRounds } = stats

    // Determine pairing strategy based on completed rounds
    // mexicanoRandomRounds should always be set for mexicano tournaments
    const useRandomPairing = completedRounds < (tournament.mexicanoRandomRounds ?? 0)

    // Generate matches based on strategy
    if (useRandomPairing) {
      return generateRandomPairings(activePlayerIndices, tournament.numberOfCourts)
    } else {
      return generateRankingBasedPairings(tournament, activePlayerIndices)
    }
  } else {
    console.error(`Unsupported tournament format: ${tournament.format}`)
    return []
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

// ============================================================================
// AMERICANO ROUND GENERATION
// ============================================================================

/**
 * Generates matches using diversity-based pairings (Americano format).
 * Uses greedy algorithm to maximize partner and opponent diversity.
 * 
 * @param tournament - The tournament with match history
 * @param activePlayerIndices - Player indices participating this round
 * @returns Array of matches optimized for diversity
 */
export function generateAmericanoPairings(
  tournament: StoredTournament,
  activePlayerIndices: number[]
): StoredMatch[] {
  // Track partnership and matchup history
  const partnershipHistory = calculatePartnershipHistory(tournament)
  const matchupHistory = calculateMatchupHistory(tournament)

  // Generate all possible match configurations
  const configurations = generateAllMatchConfigurations(
    activePlayerIndices,
    tournament.numberOfCourts
  )

  // If no configurations possible, return empty
  if (configurations.length === 0) {
    return []
  }

  // Score each configuration and select the best
  return selectBestConfiguration(configurations, partnershipHistory, matchupHistory)
}

/**
 * Calculates partnership history across all completed rounds.
 * Returns a map where key is "i-j" (sorted indices) and value is count.
 * 
 * @param tournament - The tournament to analyze
 * @returns Map of partnership counts
 */
export function calculatePartnershipHistory(
  tournament: StoredTournament
): Map<string, number> {
  const history = new Map<string, number>()

  // Iterate through all matches
  for (const match of tournament.matches) {
    // Record team1 partnership
    const team1Key = makePartnerKey(match.team1[0], match.team1[1])
    history.set(team1Key, (history.get(team1Key) ?? 0) + 1)

    // Record team2 partnership
    const team2Key = makePartnerKey(match.team2[0], match.team2[1])
    history.set(team2Key, (history.get(team2Key) ?? 0) + 1)
  }

  return history
}

/**
 * Calculates matchup history (who played against whom) across all completed rounds.
 * Returns a map where key is "i-j" (sorted indices) and value is count.
 * 
 * @param tournament - The tournament to analyze
 * @returns Map of matchup counts
 */
export function calculateMatchupHistory(
  tournament: StoredTournament
): Map<string, number> {
  const history = new Map<string, number>()

  // Iterate through all matches
  for (const match of tournament.matches) {
    // Each player in team1 played against each player in team2
    for (const team1Player of match.team1) {
      for (const team2Player of match.team2) {
        const matchupKey = makePartnerKey(team1Player, team2Player)
        history.set(matchupKey, (history.get(matchupKey) ?? 0) + 1)
      }
    }
  }

  return history
}

/**
 * Creates a consistent key for two player indices (sorted).
 * 
 * @param p1 - First player index
 * @param p2 - Second player index
 * @returns String key like "3-7" where first index is always smaller
 */
function makePartnerKey(p1: number, p2: number): string {
  return p1 < p2 ? `${p1}-${p2}` : `${p2}-${p1}`
}

/**
 * Generates all possible match configurations for given active players.
 * Each configuration is a valid set of matches for one round.
 * 
 * Note: For large player counts (>20), this generates a sample of configurations
 * to avoid combinatorial explosion.
 * 
 * @param activePlayerIndices - Players participating this round
 * @param numberOfCourts - Maximum courts available
 * @returns Array of possible match configurations
 */
export function generateAllMatchConfigurations(
  activePlayerIndices: number[],
  numberOfCourts: number
): StoredMatch[][] {
  const maxMatches = Math.min(numberOfCourts, Math.floor(activePlayerIndices.length / 4))
  
  // If can't form even one match, return empty
  if (maxMatches === 0) {
    return []
  }

  // For small groups, generate multiple random configurations
  // For larger groups, generate fewer to keep it performant
  const configCount = activePlayerIndices.length <= 12 ? 100 : 50
  const configurations: StoredMatch[][] = []

  for (let i = 0; i < configCount; i++) {
    const shuffled = shuffleArray([...activePlayerIndices])
    const matches: StoredMatch[] = []

    for (let m = 0; m < maxMatches; m++) {
      const baseIndex = m * 4
      matches.push({
        team1: [shuffled[baseIndex], shuffled[baseIndex + 1]],
        team2: [shuffled[baseIndex + 2], shuffled[baseIndex + 3]],
        isFinished: false,
      })
    }

    configurations.push(matches)
  }

  return configurations
}

/**
 * Scores a match configuration based on partnership and matchup history.
 * Lower score = better diversity (fewer repeats).
 * 
 * Scoring formula:
 * - Partnership penalty: repeat_count² × 10 (heavily penalize repeat partners)
 * - Matchup penalty: repeat_count² × 3 (moderately penalize repeat opponents)
 * 
 * @param configuration - Array of matches to score
 * @param partnershipHistory - Historical partnership counts
 * @param matchupHistory - Historical matchup counts
 * @returns Penalty score (lower is better)
 */
export function scoreMatchConfiguration(
  configuration: StoredMatch[],
  partnershipHistory: Map<string, number>,
  matchupHistory: Map<string, number>
): number {
  const PARTNER_WEIGHT = 10
  const OPPONENT_WEIGHT = 3
  let totalPenalty = 0

  for (const match of configuration) {
    // Penalize repeat partnerships
    const team1Key = makePartnerKey(match.team1[0], match.team1[1])
    const team1Repeats = partnershipHistory.get(team1Key) ?? 0
    totalPenalty += Math.pow(team1Repeats, 2) * PARTNER_WEIGHT

    const team2Key = makePartnerKey(match.team2[0], match.team2[1])
    const team2Repeats = partnershipHistory.get(team2Key) ?? 0
    totalPenalty += Math.pow(team2Repeats, 2) * PARTNER_WEIGHT

    // Penalize repeat matchups (opponents)
    for (const team1Player of match.team1) {
      for (const team2Player of match.team2) {
        const matchupKey = makePartnerKey(team1Player, team2Player)
        const matchupRepeats = matchupHistory.get(matchupKey) ?? 0
        totalPenalty += Math.pow(matchupRepeats, 2) * OPPONENT_WEIGHT
      }
    }
  }

  return totalPenalty
}

/**
 * Selects the best configuration from all possible configurations.
 * Chooses configuration with lowest penalty score.
 * Randomizes selection among tied configurations.
 * 
 * @param configurations - All possible match configurations
 * @param partnershipHistory - Historical partnership counts
 * @param matchupHistory - Historical matchup counts
 * @returns Best configuration (or random among tied best)
 */
export function selectBestConfiguration(
  configurations: StoredMatch[][],
  partnershipHistory: Map<string, number>,
  matchupHistory: Map<string, number>
): StoredMatch[] {
  let bestScore = Infinity
  let bestConfigurations: StoredMatch[][] = []

  // Score all configurations and track best
  for (const config of configurations) {
    const score = scoreMatchConfiguration(config, partnershipHistory, matchupHistory)
    
    if (score < bestScore) {
      bestScore = score
      bestConfigurations = [config]
    } else if (score === bestScore) {
      bestConfigurations.push(config)
    }
  }

  // Randomly select among tied best configurations
  if (bestConfigurations.length === 0) {
    return []
  }

  const randomIndex = Math.floor(Math.random() * bestConfigurations.length)
  return bestConfigurations[randomIndex]
}
