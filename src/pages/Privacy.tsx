import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { IconButton } from '../components/IconButton'
import { ArrowUp } from 'lucide-react'

export function Privacy() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen py-8 space-y-8">
      {/* Header */}
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <IconButton onClick={() => navigate(-1)} label={t('privacy.back')} />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {t('privacy.title')}
        </h1>
        <p className="text-slate-300 text-lg max-w-3xl">
          {t('privacy.intro')}
        </p>
      </div>

      {/* Content Sections */}
      <div className="container mx-auto px-4 space-y-6">
        {/* Language Preference */}
        <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 md:p-8 hover:border-slate-600 transition-colors">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-[var(--color-padel-yellow)]">📝</span>
            {t('privacy.language.title')}
          </h2>
          <p className="text-slate-300 leading-relaxed whitespace-pre-line">
            {t('privacy.language.desc')}
          </p>
        </section>

        {/* Tournament Data */}
        <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 md:p-8 hover:border-slate-600 transition-colors">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-[var(--color-padel-yellow)]">🏆</span>
            {t('privacy.tournaments.title')}
          </h2>
          <p className="text-slate-300 leading-relaxed whitespace-pre-line">
            {t('privacy.tournaments.desc')}
          </p>
        </section>

        {/* User Control */}
        <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 md:p-8 hover:border-slate-600 transition-colors">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-[var(--color-padel-yellow)]">⚙️</span>
            {t('privacy.control.title')}
          </h2>
          <p className="text-slate-300 leading-relaxed whitespace-pre-line">
            {t('privacy.control.desc')}
          </p>
        </section>
      </div>

      {/* Scroll to Top Button */}
      <div className="container mx-auto px-4 flex justify-center mt-12">
        <IconButton
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          icon={ArrowUp}
          label="Scroll to top"
        />
      </div>
    </div>
  )
}
