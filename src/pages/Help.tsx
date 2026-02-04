import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { IconButton } from '../components/IconButton'
import { Footer } from '../components/Footer'
import { ArrowUp } from 'lucide-react'

export function Help() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen py-8 space-y-8">
      {/* Header */}
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <IconButton onClick={() => navigate(-1)} label={t('help.back')} />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {t('help.title')}
        </h1>
        <p className="text-slate-300 text-lg max-w-3xl">
          {t('help.intro')}
        </p>
      </div>

      {/* Content Sections */}
      <div className="container mx-auto px-4 space-y-6">
        {/* Getting Started */}
        <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 md:p-8 hover:border-slate-600 transition-colors">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-[var(--color-padel-yellow)]">🚀</span>
            {t('help.gettingStarted.title')}
          </h2>
          <div className="text-slate-300 leading-relaxed space-y-3">
            <p className="whitespace-pre-line">{t('help.gettingStarted.desc')}</p>
          </div>
        </section>

        {/* Americano Format */}
        <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 md:p-8 hover:border-slate-600 transition-colors">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-[var(--color-padel-yellow)]">🌎</span>
            {t('help.americano.title')}
          </h2>
          <p className="text-slate-300 leading-relaxed whitespace-pre-line">
            {t('help.americano.desc')}
          </p>
        </section>

        {/* Mexicano Format */}
        <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 md:p-8 hover:border-slate-600 transition-colors">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-[var(--color-padel-yellow)]">🇲🇽</span>
            {t('help.mexicano.title')}
          </h2>
          <p className="text-slate-300 leading-relaxed whitespace-pre-line">
            {t('help.mexicano.desc')}
          </p>
        </section>

        {/* Managing Players */}
        <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 md:p-8 hover:border-slate-600 transition-colors">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-[var(--color-padel-yellow)]">👥</span>
            {t('help.players.title')}
          </h2>
          <p className="text-slate-300 leading-relaxed whitespace-pre-line">
            {t('help.players.desc')}
          </p>
        </section>

        {/* Troubleshooting */}
        <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 md:p-8 hover:border-slate-600 transition-colors">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-[var(--color-padel-yellow)]">🔧</span>
            {t('help.troubleshooting.title')}
          </h2>
          <p className="text-slate-300 leading-relaxed whitespace-pre-line">
            {t('help.troubleshooting.desc')}
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

      {/* Footer */}
      <div className="container mx-auto px-4">
        <Footer />
      </div>
    </div>
  )
}
