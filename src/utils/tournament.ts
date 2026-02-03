import type { TFunction } from 'i18next'

export function generateTournamentName(
  eventType: 'americano' | 'mexicano',
  t: TFunction
): string {
  const prefix = eventType === 'mexicano' ? 'Mex' : 'Am'
  const now = new Date()
  const day = String(now.getDate()).padStart(2, '0')
  const monthIndex = now.getMonth()
  const month = t(`months.${monthIndex}`)
  return `${prefix}_${day}_${month}`
}
