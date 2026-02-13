import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { PadelBallIcon } from '../components/layout'
import { GradientButton } from '../components/ui'
import { IconButton } from '../components/ui'
import { ContentPanel } from '../components/ui'
import { FormatComparisonCard } from '../components/content'
import { StatsBanner } from '../components/tournament'
import { Footer } from '../components/layout'
import { LanguageSwitcher } from '../components/layout'
import { Trophy, Users, Calendar, Zap, ArrowUp, Lightbulb, History, FolderOpen, CheckCircle } from 'lucide-react'

export function Home() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="space-y-6 sm:space-y-7 md:space-y-8">
      {/* Language Switcher - Top Right */}
      <div className="flex justify-end">
        <LanguageSwitcher />
      </div>

      {/* Hero Section */}
      <div className="text-center space-y-4 sm:space-y-5 md:space-y-6 max-w-3xl mx-auto">
        <div className="flex flex-col items-center justify-center gap-4">
          <PadelBallIcon className="w-20 h-20 md:w-24 md:h-24" />
          <h1 className="text-4xl md:text-6xl font-bold">
            {t('appName')}
          </h1>
        </div>
        
        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto px-4">
          {t('home.subtitle')}
        </p>
      </div>

      {/* CTA Section with Benefits */}
      <ContentPanel className="text-center">
        <div className="space-y-5 sm:space-y-6 md:space-y-7">
          <div>
            <p className="text-slate-300 text-base md:text-lg mb-6">
              {t('home.cta.subtitle')}
            </p>
            <GradientButton 
              onClick={() => navigate('/create')}
              className="text-xl md:text-2xl py-4 px-8 sm:py-5 sm:px-10 md:py-6 md:px-12"
            >
              {t('home.startTournament')}
            </GradientButton>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[var(--color-padel-yellow)]" />
              <span>{t('home.cta.benefit1')}</span>
            </div>
            <div className="hidden sm:block text-slate-600">•</div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[var(--color-padel-yellow)]" />
              <span>{t('home.cta.benefit2')}</span>
            </div>
            <div className="hidden sm:block text-slate-600">•</div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[var(--color-padel-yellow)]" />
              <span>{t('home.cta.benefit3')}</span>
            </div>
          </div>
        </div>
      </ContentPanel>

      {/* Stats Banner */}
      <StatsBanner />

      {/* Format Comparison */}
      <FormatComparisonCard />

      {/* Featured Highlights - Top 3 Most Important Features */}
      <div className="space-y-3 sm:space-y-3.5 md:space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">
          {t('home.keyFeaturesTitle')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-3.5 md:gap-4">
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
        </div>
      </div>

      {/* Additional Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-3.5 md:gap-4">
        <ContentPanel>
          <div className="text-[var(--color-padel-yellow)] mb-3">
            <Zap className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold mb-2">{t('home.features.realtime.title')}</h3>
          <p className="text-slate-400">{t('home.features.realtime.description')}</p>
        </ContentPanel>
        <ContentPanel>
          <div className="text-[var(--color-padel-yellow)] mb-3">
            <FolderOpen className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold mb-2">{t('home.features.library.title')}</h3>
          <p className="text-slate-400">{t('home.features.library.description')}</p>
        </ContentPanel>
        <ContentPanel>
          <div className="text-[var(--color-padel-yellow)] mb-3">
            <History className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold mb-2">{t('home.features.stats.title')}</h3>
          <p className="text-slate-400">{t('home.features.stats.description')}</p>
        </ContentPanel>
      </div>

      {/* How It Works Section */}
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
