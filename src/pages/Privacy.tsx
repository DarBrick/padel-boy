import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { IconButton } from '../components/IconButton'
import { ContentPanel } from '../components/ContentPanel'
import { ContentWithInfoPanels } from '../components/ContentWithInfoPanels'
import { Footer } from '../components/Footer'
import { ArrowUp, Languages, Trophy, Settings } from 'lucide-react'

export function Privacy() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen py-8 space-y-6 sm:space-y-7 md:space-y-8">
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
      <div className="container mx-auto px-4 space-y-4 sm:space-y-5 md:space-y-6">
        {/* Language Preference */}
        <ContentPanel icon={Languages} title={t('privacy.language.title')}>
          <ContentWithInfoPanels i18nKey="privacy.language.desc" />
        </ContentPanel>

        {/* Tournament Data */}
        <ContentPanel icon={Trophy} title={t('privacy.tournaments.title')}>
          <ContentWithInfoPanels i18nKey="privacy.tournaments.desc" />
        </ContentPanel>

        {/* Your Control */}
        <ContentPanel icon={Settings} title={t('privacy.control.title')}>
          <ContentWithInfoPanels i18nKey="privacy.control.desc" />
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
