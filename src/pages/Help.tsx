import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { IconButton } from '../components/IconButton'
import { ContentPanel } from '../components/ContentPanel'
import { Footer } from '../components/Footer'
import { ArrowUp, Rocket, Globe, Swords, Users, Wrench } from 'lucide-react'

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
        <ContentPanel icon={Rocket} title={t('help.gettingStarted.title')}>
          {t('help.gettingStarted.desc')}
        </ContentPanel>

        {/* Americano Format */}
        <ContentPanel icon={Globe} title={t('help.americano.title')}>
          {t('help.americano.desc')}
        </ContentPanel>

        {/* Mexicano Format */}
        <ContentPanel icon={Swords} title={t('help.mexicano.title')}>
          {t('help.mexicano.desc')}
        </ContentPanel>

        {/* Managing Players */}
        <ContentPanel icon={Users} title={t('help.players.title')}>
          {t('help.players.desc')}
        </ContentPanel>

        {/* Troubleshooting */}
        <ContentPanel icon={Wrench} title={t('help.troubleshooting.title')}>
          <div dangerouslySetInnerHTML={{ __html: t('help.troubleshooting.desc') }} />
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
