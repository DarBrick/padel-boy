import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { PadelBallIcon } from '../components/PadelBallIcon'
import { GradientButton } from '../components/GradientButton'
import { IconButton } from '../components/IconButton'
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
        <FeatureCard
          icon={<Trophy className="w-8 h-8" />}
          title={t('home.features.formats.title')}
          description={t('home.features.formats.description')}
        />
        <FeatureCard
          icon={<Users className="w-8 h-8" />}
          title={t('home.features.players.title')}
          description={t('home.features.players.description')}
        />
        <FeatureCard
          icon={<Calendar className="w-8 h-8" />}
          title={t('home.features.rounds.title')}
          description={t('home.features.rounds.description')}
        />
        <FeatureCard
          icon={<Zap className="w-8 h-8" />}
          title={t('home.features.realtime.title')}
          description={t('home.features.realtime.description')}
        />
      </div>

      {/* Info Section */}
      <div className="mt-12 p-6 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-[var(--color-padel-yellow)]/50 transition-colors">
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
      <footer className="mt-16 pt-8 pb-4 border-t border-slate-700/50 text-center text-slate-400 text-sm space-y-3">
        <div>
          <button
            onClick={() => navigate('/privacy')}
            className="text-slate-400 hover:text-[var(--color-padel-yellow)] underline transition-colors"
          >
            {t('privacy.title')}
          </button>
        </div>
        <div>{t('footer.createdBy')}</div>
      </footer>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-[var(--color-padel-yellow)]/50 transition-colors">
      <div className="text-[var(--color-padel-yellow)] mb-3">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </div>
  )
}
