import type { StoredTournament } from '../schemas/tournament'
import { getTournamentStats } from './tournamentStats'
import { extractTimestampFromId } from './tournamentId'

/**
 * Tournament status based on progress
 */
export type TournamentStatus = 'setup' | 'in-progress' | 'finished'

/**
 * Quick filter options for tournament search
 */
export interface TournamentFilters {
  /** Filter by tournament format (e.g., 'americano', 'mexicano') */
  format?: string
  /** Filter by tournament status */
  status?: TournamentStatus
  /** Filter by date range (inclusive) - start date */
  dateFrom?: Date
  /** Filter by date range (inclusive) - end date */
  dateTo?: Date
}

/**
 * Determines tournament status based on match progress
 */
export function getTournamentStatus(tournament: StoredTournament): TournamentStatus {
  const stats = getTournamentStats(tournament)
  // Map from TournamentStats status to TournamentSearch status
  if (stats.status === 'playing') {
    return 'in-progress'
  }
  return stats.status
}

/**
 * Normalizes text by removing accents/diacritics to enable accent-insensitive search.
 * 
 * Supports characters from popular languages:
 * - Polish: ą, ę, ć, ł, ń, ó, ś, ź, ż → a, e, c, l, n, o, s, z, z
 * - German: ä, ö, ü, ß → a, o, u, ss
 * - French: é, è, ê, ë, à, ç → e, e, e, e, a, c
 * - Spanish: ñ, á, í, ó, ú → n, a, i, o, u
 * - Portuguese: ã, õ, ç, â → a, o, c, a
 * - Scandinavian: Ø, ø, Å, å, Æ, æ → O, o, A, a, AE, ae
 * - Czech/Slovak: ř, š, č, ž, ň → r, s, c, z, n
 * - Turkish: ğ, ş, ç, ü → g, s, c, u
 * - And many more...
 * 
 * @example
 * normalizeText("Łukasz") // "Lukasz"
 * normalizeText("Müller") // "Muller"
 * normalizeText("Frédéric") // "Frederic"
 * normalizeText("Szczęsny") // "Szczesny"
 */
export function normalizeText(text: string): string {
  // First, handle standard diacritics using NFD normalization
  let normalized = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  
  // Then handle special characters that aren't decomposable
  const specialChars: Record<string, string> = {
    'Ł': 'L', 'ł': 'l',
    'Ø': 'O', 'ø': 'o',
    'Đ': 'D', 'đ': 'd',
    'Þ': 'Th', 'þ': 'th',
    'ß': 'ss',
    'Æ': 'AE', 'æ': 'ae',
    'Œ': 'OE', 'œ': 'oe',
  }
  
  for (const [special, replacement] of Object.entries(specialChars)) {
    normalized = normalized.replace(new RegExp(special, 'g'), replacement)
  }
  
  return normalized
}

/**
 * Filters tournaments based on a search query and optional quick filters.
 * 
 * Features:
 * - Multi-word search: each word is treated separately
 * - Intersection logic: all words must match for a tournament to be included
 * - Case-insensitive search
 * - Accent-insensitive search (e.g., "lukas" matches "Łukasz")
 * - Searches both tournament names and player names
 * - Quick filters: format, status, date range
 * 
 * @param tournaments - Array of tournaments to filter
 * @param searchQuery - Search query string (can contain multiple words)
 * @param filters - Optional quick filters for format, status, and date range
 * @returns Filtered array of tournaments matching all criteria
 * 
 * @example
 * ```ts
 * // Text search only
 * const results = filterTournamentsBySearch(tournaments, "John Summer")
 * 
 * // With quick filters
 * const results = filterTournamentsBySearch(tournaments, "John", {
 *   format: 'americano',
 *   status: 'finished',
 *   dateFrom: new Date('2024-01-01'),
 *   dateTo: new Date('2024-12-31')
 * })
 * ```
 */
export function filterTournamentsBySearch(
  tournaments: StoredTournament[],
  searchQuery: string,
  filters?: TournamentFilters
): StoredTournament[] {
  let filtered = tournaments
  
  // Apply text search filter
  if (searchQuery.trim()) {
    // Split query into individual words and filter empty strings
    const queryWords = searchQuery.toLowerCase().trim().split(/\s+/).filter(word => word.length > 0)
    const normalizedQueryWords = queryWords.map(word => normalizeText(word))
    
    filtered = filtered.filter(tournament => {
      const name = normalizeText(tournament.name?.toLowerCase() || '')
      const playerNames = tournament.players?.map(player => 
        normalizeText(player.name?.toLowerCase() || '')
      ) || []
      
      // All query words must match either tournament name or any player name
      return normalizedQueryWords.every(word => {
        // Check if word matches tournament name
        if (name.includes(word)) {
          return true
        }
        // Check if word matches any player name
        return playerNames.some(playerName => playerName.includes(word))
      })
    })
  }
  
  // Apply format filter
  if (filters?.format) {
    filtered = filtered.filter(tournament => tournament.format === filters.format)
  }
  
  // Apply status filter
  if (filters?.status) {
    filtered = filtered.filter(tournament => getTournamentStatus(tournament) === filters.status)
  }
  
  // Apply date range filter
  if (filters?.dateFrom || filters?.dateTo) {
    filtered = filtered.filter(tournament => {
      let tournamentDate: Date
      
      try {
        // Try to extract date from tournament ID (new format)
        tournamentDate = extractTimestampFromId(tournament.id)
      } catch (error) {
        // Fallback: check if tournament has createdAt field (test data or legacy format)
        if ('createdAt' in tournament && tournament.createdAt) {
          tournamentDate = new Date((tournament as any).createdAt)
        } else {
          // Cannot determine date, exclude from results
          console.warn('Cannot determine tournament date, no valid ID or createdAt field:', tournament.id)
          return false
        }
      }
      
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom)
        fromDate.setHours(0, 0, 0, 0)
        if (tournamentDate < fromDate) {
          return false
        }
      }
      
      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo)
        toDate.setHours(23, 59, 59, 999)
        if (tournamentDate > toDate) {
          return false
        }
      }
      
      return true
    })
  }
  
  return filtered
}
