import type { TFunction } from 'i18next'
import type { StoredTournament } from '../schemas/tournament'
import { extractTimestampFromId } from './tournamentId'

export interface GroupedTournaments {
  label: string
  tournaments: StoredTournament[]
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

function isYesterday(date: Date, today: Date): boolean {
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  return isSameDay(date, yesterday)
}

function isThisWeek(date: Date, today: Date): boolean {
  const weekAgo = new Date(today)
  weekAgo.setDate(weekAgo.getDate() - 7)
  return date >= weekAgo && date < today && !isYesterday(date, today)
}

function getMonthYearKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function formatGroupLabel(date: Date, t: TFunction, groupType: 'today' | 'yesterday' | 'thisWeek' | 'monthYear'): string {
  if (groupType === 'today') {
    return t('pastTournaments.groups.today')
  }
  if (groupType === 'yesterday') {
    return t('pastTournaments.groups.yesterday')
  }
  if (groupType === 'thisWeek') {
    return t('pastTournaments.groups.thisWeek')
  }
  
  // Month Year format
  const monthKey = `calendar.months.${date.getMonth()}`
  // @ts-ignore - dynamic key for calendar months
  const monthName = t(monthKey)
  return `${monthName} ${date.getFullYear()}`
}

export function groupTournamentsByDate(
  tournaments: StoredTournament[],
  t: TFunction
): GroupedTournaments[] {
  const now = new Date()
  
  const groups: {
    today: StoredTournament[]
    yesterday: StoredTournament[]
    thisWeek: StoredTournament[]
    monthYear: Map<string, StoredTournament[]>
  } = {
    today: [],
    yesterday: [],
    thisWeek: [],
    monthYear: new Map(),
  }
  
  // Sort tournaments by date (newest first)
  const sortedTournaments = [...tournaments].sort((a, b) => {
    const dateA = extractTimestampFromId(a.id)
    const dateB = extractTimestampFromId(b.id)
    return dateB.getTime() - dateA.getTime()
  })
  
  // Group tournaments
  for (const tournament of sortedTournaments) {
    const date = extractTimestampFromId(tournament.id)
    
    if (isSameDay(date, now)) {
      groups.today.push(tournament)
    } else if (isYesterday(date, now)) {
      groups.yesterday.push(tournament)
    } else if (isThisWeek(date, now)) {
      groups.thisWeek.push(tournament)
    } else {
      const key = getMonthYearKey(date)
      const existing = groups.monthYear.get(key) || []
      groups.monthYear.set(key, [...existing, tournament])
    }
  }
  
  // Build result array
  const result: GroupedTournaments[] = []
  
  if (groups.today.length > 0) {
    result.push({
      label: formatGroupLabel(now, t, 'today'),
      tournaments: groups.today,
    })
  }
  
  if (groups.yesterday.length > 0) {
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    result.push({
      label: formatGroupLabel(yesterday, t, 'yesterday'),
      tournaments: groups.yesterday,
    })
  }
  
  if (groups.thisWeek.length > 0) {
    result.push({
      label: formatGroupLabel(now, t, 'thisWeek'),
      tournaments: groups.thisWeek,
    })
  }
  
  // Sort month/year groups and add them
  const sortedMonthYearKeys = Array.from(groups.monthYear.keys()).sort().reverse()
  for (const key of sortedMonthYearKeys) {
    const tournaments = groups.monthYear.get(key)!
    const date = extractTimestampFromId(tournaments[0].id)
    result.push({
      label: formatGroupLabel(date, t, 'monthYear'),
      tournaments,
    })
  }
  
  return result
}

export function formatRelativeDate(date: Date, t: TFunction): string {
  const now = new Date()
  
  if (isSameDay(date, now)) {
    return t('pastTournaments.date.today')
  }
  
  if (isYesterday(date, now)) {
    return t('pastTournaments.date.yesterday')
  }
  
  // Format as "DD Mon YYYY"
  const day = date.getDate()
  const monthKey = `calendar.months.${date.getMonth()}`
  // @ts-ignore - dynamic key for calendar months
  const monthName = t(monthKey)
  const year = date.getFullYear()
  
  return `${day} ${monthName} ${year}`
}
