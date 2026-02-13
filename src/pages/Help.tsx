import { useTranslation } from 'react-i18next'
import { IconButton } from '../components/ui'
import { ContentPanel } from '../components/ui'
import { ContentWithInfoPanels } from '../components/content'
import { Footer } from '../components/layout'
import { ArrowUp, Rocket, Globe, Swords, Users, Wrench } from 'lucide-react'

export function Help() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6 sm:space-y-7 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {t('help.title')}
        </h1>
        <p className="text-slate-300 text-lg max-w-3xl">
          {t('help.intro')}
        </p>
      </div>

      {/* Content Sections */}
      <div className="space-y-4 sm:space-y-5 md:space-y-6">
        {/* Getting Started */}
        <ContentPanel icon={Rocket} title={t('help.gettingStarted.title')}>
            <ContentWithInfoPanels i18nKey="help.gettingStarted.desc" />
        </ContentPanel>

        {/* Americano Format */}
        <ContentPanel icon={Globe} title={t('help.americano.title')}>
            <ContentWithInfoPanels i18nKey="help.americano.desc" />
        </ContentPanel>

        {/* Mexicano Format */}
        <ContentPanel icon={Swords} title={t('help.mexicano.title')}>
            <ContentWithInfoPanels i18nKey="help.mexicano.desc" />
        </ContentPanel>

        {/* Managing Players */}
        <ContentPanel icon={Users} title={t('help.players.title')}>
            <ContentWithInfoPanels i18nKey="help.players.desc" />
        </ContentPanel>

        {/* Troubleshooting */}
        <ContentPanel icon={Wrench} title={t('help.troubleshooting.title')}>
            <ContentWithInfoPanels i18nKey="help.troubleshooting.desc" />
        </ContentPanel>
      </div>

      {/* Scroll to Top Button */}
      <div className="flex justify-center mt-12">
        <IconButton
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          icon={ArrowUp}
          label="Scroll to top"
        />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
