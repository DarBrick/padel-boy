import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Github, Scale } from 'lucide-react'
import { GITHUB_REPO_URL } from '../../config'
import { LanguageSwitcher } from './LanguageSwitcher'

export function Footer() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <footer className="mt-16 pt-8 pb-4 border-t border-border/60 text-center text-foreground-muted text-sm space-y-4">
      {/* Language Switcher */}
      <div className="flex justify-center">
        <LanguageSwitcher />
      </div>

      {/* Legal & Info Links */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-6">
        <button
          onClick={() => navigate('/privacy')}
          className="text-foreground-muted hover:text-padel-500 underline transition-colors"
        >
          {t('privacy.title')}
        </button>
        <button
          onClick={() => navigate('/terms')}
          className="text-foreground-muted hover:text-padel-500 underline transition-colors"
        >
          {t('terms.title')}
        </button>
      </div>

      {/* Secondary Info: Version, GitHub, License */}
      <div className="flex flex-wrap justify-center items-center gap-3 text-xs text-foreground-muted">
        <span>{t('footer.version')} 0.0.1</span>
        <span>•</span>
        <a
          href={GITHUB_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-padel-500 transition-colors"
        >
          <Github className="w-4 h-4" />
          {t('footer.github')}
        </a>
        <span>•</span>
        <a
          href={`${GITHUB_REPO_URL}/blob/main/LICENSE`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-padel-500 transition-colors"
        >
          <Scale className="w-4 h-4" />
          {t('footer.license')}
        </a>
      </div>

      {/* Creator Credit */}
      <div className="flex items-center justify-center text-foreground-muted">
        <a
          href="https://darikcube.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-padel-500 transition-colors"
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
