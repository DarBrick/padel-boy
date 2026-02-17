import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Github, Scale } from 'lucide-react'
import { GITHUB_REPO_URL } from '../../config'
import { LanguageSwitcher } from './LanguageSwitcher'

export function Footer() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <footer className="mt-16 pt-8 pb-4 border-t border-slate-700/50 text-center text-slate-400 text-sm space-y-4">
      {/* Language Switcher */}
      <div className="flex justify-center">
        <LanguageSwitcher />
      </div>

      {/* Legal & Info Links */}
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
          onClick={() => navigate('/roadmap')}
          className="text-slate-400 hover:text-[var(--color-padel-yellow)] underline transition-colors"
        >
          {t('footer.roadmap')}
        </button>
      </div>

      {/* Secondary Info: Version, GitHub, License */}
      <div className="flex flex-wrap justify-center items-center gap-3 text-xs text-slate-500">
        <span>{t('footer.version')} 0.0.1</span>
        <span>•</span>
        <a
          href={GITHUB_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-[var(--color-padel-yellow)] transition-colors"
        >
          <Github className="w-4 h-4" />
          {t('footer.github')}
        </a>
        <span>•</span>
        <a
          href={`${GITHUB_REPO_URL}/blob/main/LICENSE`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-[var(--color-padel-yellow)] transition-colors"
        >
          <Scale className="w-4 h-4" />
          {t('footer.license')}
        </a>
      </div>

      {/* Creator Credit */}
      <div className="flex items-center justify-center text-slate-400">
        <a
          href="https://darikcube.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-[var(--color-padel-yellow)] transition-colors"
        >
          <img
            src={`${import.meta.env.BASE_URL}darikcube.svg`}
            alt="Darik Cube"
            className="w-16 h-16"
          />
          <b>DARIK</b>CUBE
        </a>
      </div>
    </footer>
  )
}
