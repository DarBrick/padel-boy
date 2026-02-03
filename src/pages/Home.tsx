import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { PadelBallIcon } from '../components/PadelBallIcon'
import { Trophy, Users, Calendar, Zap, ArrowUp } from 'lucide-react'

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
        <button
          onClick={() => navigate('/create')}
          className="
            px-8 py-4 
            bg-gradient-to-r from-blue-600 to-[#D4FF00] 
            hover:from-blue-500 hover:to-[#C5F000]
            rounded-lg 
            text-lg font-semibold
            transition-all duration-200
            shadow-lg hover:shadow-xl
            transform hover:scale-105
          "
        >
          {t('home.startTournament')}
        </button>
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
      <div className="mt-12 p-6 bg-slate-800/50 rounded-lg border border-slate-700">
        <h2 className="text-2xl font-bold mb-4">{t('home.howItWorks.title')}</h2>
        <ol className="space-y-3 text-slate-300">
          <li className="flex gap-3">
            <span className="text-blue-400 font-bold">1.</span>
            <span>{t('home.howItWorks.step1')}</span>
          </li>
          <li className="flex gap-3">
            <span className="text-blue-400 font-bold">2.</span>
            <span>{t('home.howItWorks.step2')}</span>
          </li>
          <li className="flex gap-3">
            <span className="text-blue-400 font-bold">3.</span>
            <span>{t('home.howItWorks.step3')}</span>
          </li>
          <li className="flex gap-3">
            <span className="text-blue-400 font-bold">4.</span>
            <span>{t('home.howItWorks.step4')}</span>
          </li>
        </ol>
      </div>

      {/* Scroll to Top Button */}
      <div className="flex justify-center mt-12">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="
            p-3 
            bg-slate-800 
            hover:bg-slate-700 
            border border-slate-600 
            hover:border-blue-500
            rounded-full 
            transition-all duration-200
            shadow-lg hover:shadow-xl
            group
          "
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6 text-slate-400 group-hover:text-blue-400 transition-colors" />
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-16 pt-8 pb-4 border-t border-slate-700/50 text-center text-slate-400 text-sm">
        {t('footer.createdBy')}
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
    <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-blue-500/50 transition-colors">
      <div className="text-blue-400 mb-3">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </div>
  )
}
