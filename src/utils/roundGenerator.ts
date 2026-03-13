import type { StoredTournament, StoredMatch } from '../schemas/tournament'
import { getTournamentStats } from './tournamentStats'

const PARTNER_WEIGHT = 10
const OPPONENT_WEIGHT = 6
const ROUND_REPEAT_WEIGHT = 2
const EXACT_ENUMERATION_LIMIT = 2000
const MIN_SAMPLED_CONFIG_TARGET = 24
const MAX_SAMPLED_CONFIG_TARGET = 800
const MAX_SAMPLE_ATTEMPTS_MULTIPLIER = 8
const RECENT_ROUNDS_WINDOW = 4

/**
 * Generates the next round of matches for a tournament.
 * 
 * Mexicano format:
 * - Fully random pairing for the first round only
 * - Diversity-optimized pairings (Americano strategy) for additional pre-ranking rounds
 *   when mexicanoRandomRounds > 1
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
      // First round is handled above with fully random pairing.
      // Remaining pre-ranking rounds use diversity optimization.
      return generateAmericanoPairings(tournament, activePlayerIndices)
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
 * Uses deterministic cyclic rotation for predictable and balanced distribution.
 * 
 * @param tournament - The tournament configuration
 * @param sitOutCounts - Current sit-out counts per player (kept for API compatibility)
 * @returns Array of player indices who should sit out this round
 */
export function selectSittingPlayers(
  tournament: StoredTournament,
  _sitOutCounts: number[]
): number[] {
  const sittersThisRound = tournament.playerCount % 4

  // If everyone plays, no one sits
  if (sittersThisRound === 0) {
    return []
  }

  // Cyclic rotation guarantees the sit-out distribution differs by at most 1.
  const roundIndex = Math.ceil(tournament.matches.length / Math.max(1, tournament.numberOfCourts))
  const startIndex = (roundIndex * sittersThisRound) % tournament.playerCount

  return Array.from({ length: sittersThisRound }, (_, offset) => {
    return (startIndex + offset) % tournament.playerCount
  })
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
  const recentRoundFingerprintHistory = calculateRecentRoundFingerprintHistory(
    tournament,
    RECENT_ROUNDS_WINDOW
  )

  // If no configurations possible, return empty
  if (configurations.length === 0) {
    return []
  }

  // Score each configuration and select the best
  return selectBestConfiguration(
    configurations,
    partnershipHistory,
    matchupHistory,
    recentRoundFingerprintHistory
  )
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

  // Only finished matches should influence future diversity scoring.
  for (const match of tournament.matches) {
    if (!match.isFinished) {
      continue
    }

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

  // Only finished matches should influence future diversity scoring.
  for (const match of tournament.matches) {
    if (!match.isFinished) {
      continue
    }

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

  const exactConfigurations = tryGenerateExactConfigurations(
    activePlayerIndices,
    maxMatches,
    EXACT_ENUMERATION_LIMIT
  )

  if (exactConfigurations !== null) {
    return exactConfigurations
  }

  const targetCount = calculateConfigurationSampleCount(activePlayerIndices.length, maxMatches)
  const variantCountPerShuffle = Math.min(9, Math.pow(3, maxMatches))
  const maxAttempts = targetCount * MAX_SAMPLE_ATTEMPTS_MULTIPLIER
  const seen = new Set<string>()
  const configurations: StoredMatch[][] = []
  let attempts = 0

  while (configurations.length < targetCount && attempts < maxAttempts) {
    const shuffled = shuffleArray([...activePlayerIndices])
    const groups: [number, number, number, number][] = []
    for (let m = 0; m < maxMatches; m++) {
      const baseIndex = m * 4
      groups.push([
        shuffled[baseIndex],
        shuffled[baseIndex + 1],
        shuffled[baseIndex + 2],
        shuffled[baseIndex + 3],
      ])
    }

    const groupVariantSpace = Math.pow(3, maxMatches)
    const baseVariant = Math.floor(Math.random() * groupVariantSpace)

    for (let variantOffset = 0; variantOffset < variantCountPerShuffle; variantOffset++) {
      if (configurations.length >= targetCount || attempts >= maxAttempts) {
        break
      }

      attempts++

      const variantId = (baseVariant + variantOffset) % groupVariantSpace
      const configuration = buildConfigurationFromGroups(groups, variantId)
      const fingerprint = fingerprintConfiguration(configuration)
      if (seen.has(fingerprint)) {
        continue
      }

      seen.add(fingerprint)
      configurations.push(configuration)
    }
  }

  return configurations
}

function calculateConfigurationSampleCount(activePlayerCount: number, maxMatches: number): number {
  const totalPossiblePartnerships = (activePlayerCount * (activePlayerCount - 1)) / 2
  const scalingFactor = Math.max(1, maxMatches)
  const estimated = Math.ceil((Math.sqrt(totalPossiblePartnerships) * 6) / Math.sqrt(scalingFactor))
  return Math.min(MAX_SAMPLED_CONFIG_TARGET, Math.max(MIN_SAMPLED_CONFIG_TARGET, estimated))
}

function tryGenerateExactConfigurations(
  activePlayerIndices: number[],
  maxMatches: number,
  limit: number
): StoredMatch[][] | null {
  const playersNeeded = maxMatches * 4

  // Exact enumeration is only feasible when the round uses all active players.
  if (activePlayerIndices.length !== playersNeeded) {
    return null
  }

  const sortedPlayers = [...activePlayerIndices].sort((a, b) => a - b)
  const configurations: StoredMatch[][] = []
  const current: StoredMatch[] = []

  const backtrack = (remaining: number[]) => {
    if (configurations.length > limit) {
      return
    }

    if (current.length === maxMatches) {
      configurations.push(current.map(match => ({ ...match })))
      return
    }

    const anchor = remaining[0]

    for (let i = 1; i < remaining.length - 2; i++) {
      for (let j = i + 1; j < remaining.length - 1; j++) {
        for (let k = j + 1; k < remaining.length; k++) {
          const group: [number, number, number, number] = [anchor, remaining[i], remaining[j], remaining[k]]
          const groupSet = new Set(group)
          const nextRemaining = remaining.filter(player => !groupSet.has(player))

          for (let pairingOption = 0; pairingOption < 3; pairingOption++) {
            current.push(createMatchFromGroup(group, pairingOption))
            backtrack(nextRemaining)
            current.pop()

            if (configurations.length > limit) {
              return
            }
          }
        }
      }
    }
  }

  backtrack(sortedPlayers)

  if (configurations.length > limit) {
    return null
  }

  return configurations
}

function buildConfigurationFromGroups(
  groups: [number, number, number, number][],
  variantId: number
): StoredMatch[] {
  let selector = variantId
  const matches: StoredMatch[] = []

  for (const group of groups) {
    const pairingOption = selector % 3
    selector = Math.floor(selector / 3)
    matches.push(createMatchFromGroup(group, pairingOption))
  }

  return matches
}

function createMatchFromGroup(
  group: [number, number, number, number],
  pairingOption: number
): StoredMatch {
  const [a, b, c, d] = group

  if (pairingOption === 0) {
    return {
      team1: [a, b],
      team2: [c, d],
      isFinished: false,
    }
  }

  if (pairingOption === 1) {
    return {
      team1: [a, c],
      team2: [b, d],
      isFinished: false,
    }
  }

  return {
    team1: [a, d],
    team2: [b, c],
    isFinished: false,
  }
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
  matchupHistory: Map<string, number>,
  roundFingerprintHistory?: Map<string, number>
): number {
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

  if (roundFingerprintHistory) {
    const roundFingerprint = fingerprintConfiguration(configuration)
    const roundRepeats = roundFingerprintHistory.get(roundFingerprint) ?? 0
    totalPenalty += Math.pow(roundRepeats, 2) * ROUND_REPEAT_WEIGHT
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
  matchupHistory: Map<string, number>,
  roundFingerprintHistory?: Map<string, number>
): StoredMatch[] {
  let bestScore = Infinity
  let bestConfigurations: StoredMatch[][] = []

  // Score all configurations and track best
  for (const config of configurations) {
    const score = scoreMatchConfiguration(
      config,
      partnershipHistory,
      matchupHistory,
      roundFingerprintHistory
    )
    
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

function fingerprintConfiguration(configuration: StoredMatch[]): string {
  const matchFingerprints = configuration.map(match => fingerprintMatch(match))
  matchFingerprints.sort()
  return matchFingerprints.join(';')
}

function fingerprintMatch(match: StoredMatch): string {
  const team1 = [Math.min(match.team1[0], match.team1[1]), Math.max(match.team1[0], match.team1[1])]
  const team2 = [Math.min(match.team2[0], match.team2[1]), Math.max(match.team2[0], match.team2[1])]
  const team1Key = `${team1[0]}-${team1[1]}`
  const team2Key = `${team2[0]}-${team2[1]}`
  return team1Key < team2Key ? `${team1Key}|${team2Key}` : `${team2Key}|${team1Key}`
}

function calculateRecentRoundFingerprintHistory(
  tournament: StoredTournament,
  windowSize: number
): Map<string, number> {
  const history = new Map<string, number>()
  const finishedMatches = tournament.matches.filter(match => match.isFinished)
  const matchesPerRound = Math.max(1, tournament.numberOfCourts)
  const completedRounds = Math.floor(finishedMatches.length / matchesPerRound)

  if (completedRounds === 0) {
    return history
  }

  const startRound = Math.max(0, completedRounds - windowSize)

  for (let roundIndex = startRound; roundIndex < completedRounds; roundIndex++) {
    const start = roundIndex * matchesPerRound
    const end = start + matchesPerRound
    const roundMatches = finishedMatches.slice(start, end)
    const fingerprint = fingerprintConfiguration(roundMatches)
    history.set(fingerprint, (history.get(fingerprint) ?? 0) + 1)
  }

  return history
}
