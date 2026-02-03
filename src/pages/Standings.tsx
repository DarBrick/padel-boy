import { useTranslation } from 'react-i18next'

export function Standings() {
  const { t } = useTranslation()
  
  return (
    <div className="text-center py-12">
      <h1 className="text-3xl font-bold mb-4">{t('standings.title')}</h1>
      <p className="text-slate-400">Coming soon...</p>
    </div>
  )
}
