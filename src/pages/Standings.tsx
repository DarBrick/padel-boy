import { useTranslation } from 'react-i18next'

export function Standings() {
  const { t } = useTranslation()
  
  return (
    <div className="py-12 text-center sm:py-16 md:py-20">
      <h1 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">{t('standings.title')}</h1>
      <p className="text-foreground-muted text-base sm:text-lg">Coming soon...</p>
    </div>
  )
}
