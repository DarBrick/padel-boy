import { useTranslation } from 'react-i18next'
import { IconButton } from '../components/ui'
import { ContentPanel } from '../components/ui'
import { ContentWithInfoPanels } from '../components/content'
import { Footer } from '../components/layout'
import { ArrowUp, Rocket, Globe, Swords, Users, Wrench, List, Calculator, Trophy, Shuffle, PauseCircle, CircleHelp } from 'lucide-react'

export function Help() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6 sm:space-y-7 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          {t('help.title')}
        </h1>
        <p className="text-foreground-muted text-lg max-w-3xl">
          {t('help.intro')}
        </p>
      </div>

      {/* Table of Contents */}
      <section id="help-top" className="scroll-mt-24">
        <ContentPanel icon={List} title={t('help.toc.title')}>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <a className="text-padel-500 hover:text-padel-400 underline underline-offset-2" href="#help-getting-started">
                {t('help.toc.gettingStarted')}
              </a>
            </li>
            <li>
              <a className="text-padel-500 hover:text-padel-400 underline underline-offset-2" href="#help-scoring">
                {t('help.toc.scoring')}
              </a>
            </li>
            <li>
              <a className="text-padel-500 hover:text-padel-400 underline underline-offset-2" href="#help-ranking">
                {t('help.toc.ranking')}
              </a>
            </li>
            <li>
              <a className="text-padel-500 hover:text-padel-400 underline underline-offset-2" href="#help-next-round-lineup">
                {t('help.toc.nextRoundLineup')}
              </a>
            </li>
            <li>
              <a className="text-padel-500 hover:text-padel-400 underline underline-offset-2" href="#help-sit-outs">
                {t('help.toc.sitOuts')}
              </a>
            </li>
            <li>
              <a className="text-padel-500 hover:text-padel-400 underline underline-offset-2" href="#help-americano">
                {t('help.toc.americano')}
              </a>
            </li>
            <li>
              <a className="text-padel-500 hover:text-padel-400 underline underline-offset-2" href="#help-mexicano">
                {t('help.toc.mexicano')}
              </a>
            </li>
            <li>
              <a className="text-padel-500 hover:text-padel-400 underline underline-offset-2" href="#help-players">
                {t('help.toc.players')}
              </a>
            </li>
            <li>
              <a className="text-padel-500 hover:text-padel-400 underline underline-offset-2" href="#help-troubleshooting">
                {t('help.toc.troubleshooting')}
              </a>
            </li>
            <li>
              <a className="text-padel-500 hover:text-padel-400 underline underline-offset-2" href="#help-faq">
                {t('help.toc.faq')}
              </a>
            </li>
          </ol>
        </ContentPanel>
      </section>

      {/* Content Sections */}
      <div className="space-y-4 sm:space-y-5 md:space-y-6">
        {/* Getting Started */}
        <section id="help-getting-started" className="scroll-mt-24">
          <ContentPanel icon={Rocket} title={t('help.gettingStarted.title')}>
            <ContentWithInfoPanels i18nKey="help.gettingStarted.desc" />
          </ContentPanel>
        </section>

        {/* Scoring */}
        <section id="help-scoring" className="scroll-mt-24">
          <ContentPanel icon={Calculator} title={t('help.scoring.title')}>
            <ContentWithInfoPanels i18nKey="help.scoring.desc" />
          </ContentPanel>
        </section>

        {/* Ranking */}
        <section id="help-ranking" className="scroll-mt-24">
          <ContentPanel icon={Trophy} title={t('help.ranking.title')}>
            <ContentWithInfoPanels i18nKey="help.ranking.desc" />
          </ContentPanel>
        </section>

        {/* Next Round Lineup */}
        <section id="help-next-round-lineup" className="scroll-mt-24">
          <ContentPanel icon={Shuffle} title={t('help.nextRoundLineup.title')}>
            <ContentWithInfoPanels i18nKey="help.nextRoundLineup.desc" />
          </ContentPanel>
        </section>

        {/* Sit Outs */}
        <section id="help-sit-outs" className="scroll-mt-24">
          <ContentPanel icon={PauseCircle} title={t('help.sitOuts.title')}>
            <ContentWithInfoPanels i18nKey="help.sitOuts.desc" />
          </ContentPanel>
        </section>

        {/* Americano Format */}
        <section id="help-americano" className="scroll-mt-24">
          <ContentPanel icon={Globe} title={t('help.americano.title')}>
            <ContentWithInfoPanels i18nKey="help.americano.desc" />
          </ContentPanel>
        </section>

        {/* Mexicano Format */}
        <section id="help-mexicano" className="scroll-mt-24">
          <ContentPanel icon={Swords} title={t('help.mexicano.title')}>
            <ContentWithInfoPanels i18nKey="help.mexicano.desc" />
          </ContentPanel>
        </section>

        {/* Managing Players */}
        <section id="help-players" className="scroll-mt-24">
          <ContentPanel icon={Users} title={t('help.players.title')}>
            <ContentWithInfoPanels i18nKey="help.players.desc" />
          </ContentPanel>
        </section>

        {/* Troubleshooting */}
        <section id="help-troubleshooting" className="scroll-mt-24">
          <ContentPanel icon={Wrench} title={t('help.troubleshooting.title')}>
            <ContentWithInfoPanels i18nKey="help.troubleshooting.desc" />
          </ContentPanel>
        </section>

        {/* FAQ */}
        <section id="help-faq" className="scroll-mt-24">
          <ContentPanel icon={CircleHelp} title={t('help.faq.title')}>
            <ContentWithInfoPanels i18nKey="help.faq.desc" />
          </ContentPanel>
        </section>
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
