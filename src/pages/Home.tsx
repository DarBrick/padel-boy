import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { PadelBallIcon } from '../components/PadelBallIcon'
import { GradientButton } from '../components/GradientButton'
import { IconButton } from '../components/IconButton'
import { ContentPanel } from '../components/ContentPanel'
import { InfoPanel } from '../components/InfoPanel'
import { Footer } from '../components/Footer'
import { Trophy, Users, Calendar, Zap, ArrowUp, Lightbulb, Sparkles, History } from 'lucide-react'

export function Home() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="space-y-6 sm:space-y-7 md:space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 sm:space-y-5 md:space-y-6">
        <div className="flex flex-col items-center justify-center gap-4">
          <PadelBallIcon className="w-20 h-20 md:w-24 md:h-24" />
          <h1 className="text-4xl md:text-6xl font-bold">
            {t('appName')}
          </h1>
        </div>
        
        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
          {t('home.subtitle')}
        </p>
        
        {/* Under Development Notice */}
        <InfoPanel>
          <div className="space-y-2">
            <p className="text-slate-300 text-sm md:text-base">
              {t('home.underDevelopment')}
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => navigate('/roadmap')}
                className="flex items-center gap-2 text-sm md:text-base text-[var(--color-padel-yellow)] hover:text-[var(--color-padel-yellow)]/80 transition-colors font-semibold"
              >
                <Sparkles className="w-4 h-4" />
                {t('home.viewRoadmap')}
              </button>
            </div>
          </div>
        </InfoPanel>
      </div>

      {/* CTA Button */}
      <div className="flex flex-col items-center gap-5 sm:gap-6 md:gap-7">
        <GradientButton onClick={() => navigate('/create')}>
          {t('home.startTournament')}
        </GradientButton>
        
        <button
          onClick={() => navigate('/past')}
          className="flex items-center gap-2 px-6 py-3 text-base font-medium text-slate-300 hover:text-[var(--color-padel-yellow)] transition-colors"
        >
          <History className="w-5 h-5" />
          {t('home.viewPastTournaments')}
        </button>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5 md:gap-4">
        <ContentPanel>
          <div className="text-[var(--color-padel-yellow)] mb-3">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold mb-2">{t('home.features.formats.title')}</h3>
          <p className="text-slate-400">{t('home.features.formats.description')}</p>
        </ContentPanel>
        <ContentPanel>
          <div className="text-[var(--color-padel-yellow)] mb-3">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold mb-2">{t('home.features.players.title')}</h3>
          <p className="text-slate-400">{t('home.features.players.description')}</p>
        </ContentPanel>
        <ContentPanel>
          <div className="text-[var(--color-padel-yellow)] mb-3">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold mb-2">{t('home.features.rounds.title')}</h3>
          <p className="text-slate-400">{t('home.features.rounds.description')}</p>
        </ContentPanel>
        <ContentPanel>
          <div className="text-[var(--color-padel-yellow)] mb-3">
            <Zap className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold mb-2">{t('home.features.realtime.title')}</h3>
          <p className="text-slate-400">{t('home.features.realtime.description')}</p>
        </ContentPanel>
      </div>

      {/* Info Section */}
      <ContentPanel>
        <div className="text-[var(--color-padel-yellow)] mb-3">
          <Lightbulb className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold mb-4">{t('home.howItWorks.title')}</h3>
        <ol className="space-y-2 sm:space-y-2.5 md:space-y-3 text-slate-300">
          <li className="flex gap-3">
            <span className="text-[var(--color-padel-yellow)] font-bold">1.</span>
            <span>{t('home.howItWorks.step1')}</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[var(--color-padel-yellow)] font-bold">2.</span>
            <span>{t('home.howItWorks.step2')}</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[var(--color-padel-yellow)] font-bold">3.</span>
            <span>{t('home.howItWorks.step3')}</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[var(--color-padel-yellow)] font-bold">4.</span>
            <span>{t('home.howItWorks.step4')}</span>
          </li>
        </ol>
      </ContentPanel>

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
