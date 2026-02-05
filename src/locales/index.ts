import en from './en'
import es from './es'
import pl from './pl'

export const supportedLngs = ['en', 'pl', 'es'] as const
export type SupportedLng = (typeof supportedLngs)[number]

export const resources = {
  en,
  pl,
  es,
} as const
