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
  const typeName = eventType === 'mexicano' ? 'Mexicano' : 'Americano'
  const now = new Date()
  const day = now.getDate()
  const monthIndex = now.getMonth()
  const month = t(`months.${monthIndex}`)
  const dayOfWeekIndex = now.getDay()
  const dayOfWeek = t(`weekdays.${dayOfWeekIndex}`)
  
  // Get current language from i18next
  const language = t('lang')
  const ordinalSuffix = getOrdinalSuffix(day, language)
  
  return `${typeName} ${dayOfWeek}, ${month} ${day}${ordinalSuffix}`
}
