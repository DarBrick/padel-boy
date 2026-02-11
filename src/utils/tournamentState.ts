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

/** Mark a tournament as finished. Returns a new tournament object. */
export function finishTournament(tournament: StoredTournament): StoredTournament {
  return {
    ...tournament,
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
