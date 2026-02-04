import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { PadelBallIcon } from '../components/PadelBallIcon'
import { GradientButton } from '../components/GradientButton'
import { IconButton } from '../components/IconButton'
import { ContentPanel } from '../components/ContentPanel'
import { Footer } from '../components/Footer'
import { Trophy, Users, Calendar, Zap, ArrowUp, Lightbulb } from 'lucide-react'

export function Home() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-4">
          <PadelBallIcon className="w-20 h-20 md:w-24 md:h-24" />
          <h1 className="text-4xl md:text-6xl font-bold">
            {t('appName')}
          </h1>
        </div>
        
        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
          {t('home.subtitle')}
        </p>
      </div>

      {/* CTA Button */}
      <div className="flex justify-center">
        <GradientButton onClick={() => navigate('/create')}>
          {t('home.startTournament')}
        </GradientButton>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
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
      <ContentPanel className="mt-12">
        <h2 className="text-2xl font-bold mb-4">
          <Lightbulb className="w-6 h-6 inline-block mr-2 text-[var(--color-padel-yellow)]" />
          {t('home.howItWorks.title')}
        </h2>
        <ol className="space-y-3 text-slate-300">
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
