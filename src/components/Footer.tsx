import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Github, Scale } from 'lucide-react'
import { LanguageSwitcher } from './LanguageSwitcher'

export function Footer() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <footer className="mt-16 pt-8 pb-4 border-t border-slate-700/50 text-center text-slate-400 text-sm space-y-4">
      {/* Primary Navigation Links */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-6">
        <button
          onClick={() => navigate('/')}
          className="text-slate-400 hover:text-[var(--color-padel-yellow)] underline transition-colors"
        >
          {t('footer.home')}
        </button>
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

      {/* Secondary Info: Version, GitHub, License */}
      <div className="flex flex-wrap justify-center items-center gap-3 text-xs text-slate-500">
        <span>{t('footer.version')} 0.0.1</span>
        <span>•</span>
        <a
          href="https://github.com/DarBrick/padel-boy"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-[var(--color-padel-yellow)] transition-colors"
        >
          <Github className="w-4 h-4" />
          {t('footer.github')}
        </a>
        <span>•</span>
        <a
          href="https://github.com/DarBrick/padel-boy/blob/main/LICENSE"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-[var(--color-padel-yellow)] transition-colors"
        >
          <Scale className="w-4 h-4" />
          {t('footer.license')}
        </a>
      </div>

      {/* Language Selector */}
      <div className="flex justify-center">
        <LanguageSwitcher />
      </div>

      {/* Creator Credit */}
      <div className="text-slate-400">
        {t('footer.createdBy')}
      </div>
    </footer>
  )
}
