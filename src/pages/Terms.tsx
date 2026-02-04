import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { IconButton } from '../components/IconButton'
import { Footer } from '../components/Footer'
import { ArrowUp } from 'lucide-react'

export function Terms() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen py-8 space-y-8">
      {/* Header */}
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <IconButton onClick={() => navigate(-1)} label={t('terms.back')} />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {t('terms.title')}
        </h1>
        <p className="text-slate-300 text-lg max-w-3xl">
          {t('terms.intro')}
        </p>
      </div>

      {/* Content Sections */}
      <div className="container mx-auto px-4 space-y-6">
        {/* Service Description */}
        <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 md:p-8 hover:border-slate-600 transition-colors">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-[var(--color-padel-yellow)]">📋</span>
            {t('terms.service.title')}
          </h2>
          <p className="text-slate-300 leading-relaxed whitespace-pre-line">
            {t('terms.service.desc')}
          </p>
        </section>

        {/* User Responsibilities */}
        <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 md:p-8 hover:border-slate-600 transition-colors">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-[var(--color-padel-yellow)]">👤</span>
            {t('terms.responsibilities.title')}
          </h2>
          <p className="text-slate-300 leading-relaxed whitespace-pre-line">
            {t('terms.responsibilities.desc')}
          </p>
        </section>

        {/* Disclaimer */}
        <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 md:p-8 hover:border-slate-600 transition-colors">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-[var(--color-padel-yellow)]">⚠️</span>
            {t('terms.disclaimer.title')}
          </h2>
          <p className="text-slate-300 leading-relaxed whitespace-pre-line">
            {t('terms.disclaimer.desc')}
          </p>
        </section>

        {/* Liability */}
        <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 md:p-8 hover:border-slate-600 transition-colors">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-[var(--color-padel-yellow)]">🛡️</span>
            {t('terms.liability.title')}
          </h2>
          <p className="text-slate-300 leading-relaxed whitespace-pre-line">
            {t('terms.liability.desc')}
          </p>
        </section>

        {/* Changes */}
        <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 md:p-8 hover:border-slate-600 transition-colors">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-[var(--color-padel-yellow)]">🔄</span>
            {t('terms.changes.title')}
          </h2>
          <p className="text-slate-300 leading-relaxed whitespace-pre-line">
            {t('terms.changes.desc')}
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
