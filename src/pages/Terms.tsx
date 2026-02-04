import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { IconButton } from '../components/IconButton'
import { ContentPanel } from '../components/ContentPanel'
import { Footer } from '../components/Footer'
import { ArrowUp, FileText, UserCheck, AlertTriangle, Shield, RefreshCw } from 'lucide-react'

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
        <ContentPanel icon={FileText} title={t('terms.service.title')}>
          {t('terms.service.desc')}
        </ContentPanel>

        {/* User Responsibilities */}
        <ContentPanel icon={UserCheck} title={t('terms.responsibilities.title')}>
          {t('terms.responsibilities.desc')}
        </ContentPanel>

        {/* Disclaimer */}
        <ContentPanel icon={AlertTriangle} title={t('terms.disclaimer.title')}>
          {t('terms.disclaimer.desc')}
        </ContentPanel>

        {/* Liability */}
        <ContentPanel icon={Shield} title={t('terms.liability.title')}>
          {t('terms.liability.desc')}
        </ContentPanel>

        {/* Changes */}
        <ContentPanel icon={RefreshCw} title={t('terms.changes.title')}>
          {t('terms.changes.desc')}
        </ContentPanel>
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
