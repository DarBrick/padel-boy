import type { TFunction } from 'i18next'

function getOrdinalSuffix(day: number, language: string): string {
  if (language === 'en') {
    if (day > 3 && day < 21) return 'th'
    switch (day % 10) {
      case 1: return 'st'
      case 2: return 'nd'
      case 3: return 'rd'
      default: return 'th'
    }
  }
  return '' // Polish and Spanish don't use ordinal suffixes
}

export function generateTournamentName(
  eventType: 'americano' | 'mexicano',
  t: TFunction
): string {
  const monthKeys = [
    'months.0',
    'months.1',
    'months.2',
    'months.3',
    'months.4',
    'months.5',
    'months.6',
    'months.7',
    'months.8',
    'months.9',
    'months.10',
    'months.11',
  ] as const

  const weekdayKeys = [
    'weekdays.0',
    'weekdays.1',
    'weekdays.2',
    'weekdays.3',
    'weekdays.4',
    'weekdays.5',
    'weekdays.6',
  ] as const

  const typeName = eventType === 'mexicano' ? 'Mexicano' : 'Americano'
  const now = new Date()
  const day = now.getDate()
  const monthIndex = now.getMonth()
  const month = t(monthKeys[monthIndex])
  const dayOfWeekIndex = now.getDay()
  const dayOfWeek = t(weekdayKeys[dayOfWeekIndex])
  
  // Get current language from i18next
  const language = t('lang')
  const ordinalSuffix = getOrdinalSuffix(day, language)
  
  return `${typeName} ${dayOfWeek}, ${month} ${day}${ordinalSuffix}`
}
