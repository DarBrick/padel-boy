import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export function Footer() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <footer className="mt-16 pt-8 pb-4 border-t border-slate-700/50 text-center text-slate-400 text-sm space-y-3">
      <div className="flex flex-wrap justify-center gap-4 md:gap-6">
        <button
          onClick={() => navigate('/privacy')}
          className="text-slate-400 hover:text-[var(--color-padel-yellow)] underline transition-colors"
        >
          {t('privacy.title')}
        </button>
        <button
          onClick={() => navigate('/terms')}
          className="text-slate-400 hover:text-[var(--color-padel-yellow)] underline transition-colors"
        >
          {t('terms.title')}
        </button>
        <button
          onClick={() => navigate('/help')}
          className="text-slate-400 hover:text-[var(--color-padel-yellow)] underline transition-colors"
        >
          {t('help.title')}
        </button>
      </div>
      <div>{t('footer.createdBy')}</div>
    </footer>
  )
}
