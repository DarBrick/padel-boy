import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Sparkles, CheckCircle2, Rocket } from 'lucide-react'

export function StatsBanner() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-padel-500/30 rounded-lg p-5 sm:p-6 md:p-7">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Active Development */}
        <div className="flex items-start gap-3">
          <div className="bg-padel-500/10 p-2.5 rounded-lg flex-shrink-0">
            <Rocket className="w-5 h-5 text-padel-500" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white mb-1">
              {t('home.stats.activelyDeveloped')}
            </div>
            <div className="text-sm text-slate-400">
              {t('home.stats.activeDevelopmentDesc')}
            </div>
          </div>
        </div>

        {/* Features Available */}
        <div className="flex items-start gap-3">
          <div className="bg-blue-500/10 p-2.5 rounded-lg flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white mb-1">
              {t('home.stats.featuresCount')}
            </div>
            <div className="text-sm text-slate-400">
              {t('home.stats.featuresCountDesc')}
            </div>
          </div>
        </div>

        {/* Roadmap Link */}
        <div className="flex items-start gap-3">
          <div className="bg-purple-500/10 p-2.5 rounded-lg flex-shrink-0">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="text-lg font-semibold text-white mb-1">
              {t('home.stats.moreComing')}
            </div>
            <button
              onClick={() => navigate('/roadmap')}
              className="text-sm text-padel-500 hover:text-padel-500/80 transition-colors underline"
            >
              {t('home.stats.viewRoadmap')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
