import type { StoredTournament, StoredMatch } from '../schemas/tournament'
import { extractTimestampFromId } from './tournamentId'

// ── Round Calculations ──────────────────────────────────────────────

/** Get total number of rounds in a tournament */
export function getTotalRounds(tournament: StoredTournament): number {
  if (tournament.matches.length === 0) return 0
  return Math.ceil(tournament.matches.length / tournament.numberOfCourts)
}

/** Get matches for a specific round (1-indexed) */
export function getRoundMatches(tournament: StoredTournament, roundNumber: number): StoredMatch[] {
  if (tournament.matches.length === 0 || roundNumber < 1) return []
  const startIndex = (roundNumber - 1) * tournament.numberOfCourts
  const endIndex = roundNumber * tournament.numberOfCourts
  return tournament.matches.slice(startIndex, endIndex)
}

/** Check if all matches in a given round are finished */
export function isRoundComplete(tournament: StoredTournament, roundNumber: number): boolean {
  const matches = getRoundMatches(tournament, roundNumber)
  return matches.length > 0 && matches.every(m => m.isFinished)
}

/** Count unfinished matches in a given round */
export function getRemainingMatchCount(tournament: StoredTournament, roundNumber: number): number {
  return getRoundMatches(tournament, roundNumber).filter(m => !m.isFinished).length
}

/** Get player indices who are pausing (not playing) in a given round */
export function getPausingPlayers(tournament: StoredTournament, roundNumber: number): number[] {
  const matches = getRoundMatches(tournament, roundNumber)
  if (matches.length === 0) return []

  // Collect all player indices who are playing in this round
  const playingPlayerIndices = new Set<number>()
  matches.forEach(match => {
    match.team1.forEach(playerIndex => {
      playingPlayerIndices.add(playerIndex)
    })
    match.team2.forEach(playerIndex => {
      playingPlayerIndices.add(playerIndex)
    })
  })

  // Find all players who are NOT playing
  const allPlayerIndices = Array.from({ length: tournament.playerCount }, (_, i) => i)
  return allPlayerIndices.filter(i => !playingPlayerIndices.has(i))
}

/** Check if the given round is the last available round */
export function isLastRound(tournament: StoredTournament, roundNumber: number): boolean {
  return roundNumber === getTotalRounds(tournament)
}

// ── Tournament Status ───────────────────────────────────────────────

/** Check if the tournament has been explicitly finished */
export function isTournamentFinished(tournament: StoredTournament): boolean {
  return !!tournament.finishedAt
}

/** Check if the tournament can generate a next round */
export function canGenerateNextRound(tournament: StoredTournament, currentRound: number): boolean {
  return (
    !isTournamentFinished(tournament) &&
    isLastRound(tournament, currentRound) &&
    isRoundComplete(tournament, currentRound)
  )
}

// ── Match Index Mapping ─────────────────────────────────────────────

/** Convert a local match index within a round to a global match index */
export function toGlobalMatchIndex(
  tournament: StoredTournament,
  roundNumber: number,
  localIndex: number,
): number {
  return (roundNumber - 1) * tournament.numberOfCourts + localIndex
}

// ── Tournament Mutations (pure, return new tournament) ──────────────

/** Update a single match within a round. Returns a new tournament object. */
export function updateMatch(
  tournament: StoredTournament,
  roundNumber: number,
  localMatchIndex: number,
  updatedMatch: StoredMatch,
): StoredTournament {
  const globalIndex = toGlobalMatchIndex(tournament, roundNumber, localMatchIndex)
  const updatedMatches = [...tournament.matches]
  updatedMatches[globalIndex] = updatedMatch

  return { ...tournament, matches: updatedMatches }
}

/** Append new round matches to the tournament. Returns a new tournament object. */
export function appendRoundMatches(
  tournament: StoredTournament,
  newMatches: StoredMatch[],
): StoredTournament {
  return {
    ...tournament,
    matches: [...tournament.matches, ...newMatches],
  }
}

/** Check if a round has no matches with scores (all matches are unfinished) */
export function hasNoScoredMatches(tournament: StoredTournament, roundNumber: number): boolean {
  const matches = getRoundMatches(tournament, roundNumber)
  return matches.length > 0 && matches.every(m => !m.isFinished)
}

/** Check if tournament can be finished from the current round */
export function canFinishTournament(tournament: StoredTournament, currentRound: number): boolean {
  if (!isLastRound(tournament, currentRound)) return false
  
  // Scenario A: All matches in the round are completed
  if (isRoundComplete(tournament, currentRound)) return true
  
  // Scenario B: Round is 2 or above AND no matches have scores
  if (currentRound >= 2 && hasNoScoredMatches(tournament, currentRound)) return true
  
  return false
}

/**
 * Mark a tournament as finished. Returns a new tournament object.
 * If removeIncompleteRound is true, removes the last round's matches if they're all incomplete.
 */
export function finishTournament(
  tournament: StoredTournament,
  removeIncompleteRound: boolean = false
): StoredTournament {
  let finalMatches = tournament.matches
  
  // Remove incomplete matches from the last round if requested
  if (removeIncompleteRound) {
    const totalRounds = getTotalRounds(tournament)
    if (totalRounds > 0 && hasNoScoredMatches(tournament, totalRounds)) {
      const matchesPerRound = tournament.numberOfCourts
      const keepUntilIndex = (totalRounds - 1) * matchesPerRound
      finalMatches = tournament.matches.slice(0, keepUntilIndex)
    }
  }
  
  return {
    ...tournament,
    matches: finalMatches,
    finishedAt: Date.now(),
  }
}

// ── Formatting ──────────────────────────────────────────────────────

/** Format tournament date from its encoded ID */
export function formatTournamentDate(
  tournament: StoredTournament,
  locale?: string,
): string {
  try {
    const timestamp = extractTimestampFromId(tournament.id)
    const date = new Date(timestamp)
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return ''
  }
}

// ── Round Param Validation ──────────────────────────────────────────

/**
 * Parse and clamp a round query parameter to a valid round number.
 * Returns the validated round number, defaulting to the last round.
 */
export function parseRoundParam(
  tournament: StoredTournament,
  roundParam: string | null,
): number {
  const total = getTotalRounds(tournament)
  if (total === 0) return 1

  if (roundParam) {
    const parsed = parseInt(roundParam, 10)
    if (!isNaN(parsed) && parsed >= 1 && parsed <= total) {
      return parsed
    }
  }
  return total
}

// ── Player Match Outcomes ───────────────────────────────────────────

export type MatchOutcome = 'won' | 'lost' | 'drew' | 'paused'

export interface PlayerMatchOutcome {
  outcome: MatchOutcome
  pointsEarned: number
}

/**
 * Determine a player's outcome and points earned in a specific round.
 * Returns 'paused' if the player was sitting out, otherwise checks match result.
 */
export function getPlayerMatchOutcome(
  tournament: StoredTournament,
  playerIndex: number,
  roundNumber: number,
): PlayerMatchOutcome {
  // Check if player was pausing
  const pausingPlayers = getPausingPlayers(tournament, roundNumber)
  if (pausingPlayers.includes(playerIndex)) {
    const sittingPointsPerRound = Math.ceil(tournament.pointsPerGame * 0.5)
    return {
      outcome: 'paused',
      pointsEarned: sittingPointsPerRound,
    }
  }

  // Find the match this player participated in
  const roundMatches = getRoundMatches(tournament, roundNumber)
  const match = roundMatches.find(
    m => m.team1.includes(playerIndex) || m.team2.includes(playerIndex)
  )

  // If no match found or match not finished, return default
  if (!match || !match.isFinished || match.winner === undefined || match.scoreDelta === undefined) {
    return { outcome: 'lost', pointsEarned: 0 }
  }

  // Determine which team the player is on
  const isTeam1 = match.team1.includes(playerIndex)
  const playerTeamIndex = isTeam1 ? 0 : 1
  const isDraw = match.scoreDelta === 0

  // Calculate scores
  const winningScore = Math.floor((tournament.pointsPerGame + match.scoreDelta) / 2)
  const losingScore = Math.floor((tournament.pointsPerGame - match.scoreDelta) / 2)
  
  let outcome: MatchOutcome
  let pointsEarned: number

  if (isDraw) {
    outcome = 'drew'
    pointsEarned = winningScore // Both teams get the same points in a draw
  } else if (match.winner === playerTeamIndex) {
    outcome = 'won'
    pointsEarned = winningScore
  } else {
    outcome = 'lost'
    pointsEarned = losingScore
  }

  return { outcome, pointsEarned }
}
