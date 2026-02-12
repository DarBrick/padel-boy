import { useTranslation } from 'react-i18next'
import { IconButton } from '../components/IconButton'
import { ContentPanel } from '../components/ContentPanel'
import { Footer } from '../components/Footer'
import { CheckCircle2, Clock, Circle, ArrowUp } from 'lucide-react'

export function Roadmap() {
  const { t } = useTranslation()

  const features = t('roadmap.features', { returnObjects: true }) as readonly string[]

  return (
    <div className="space-y-6 sm:space-y-7 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {t('roadmap.title')}
        </h1>
        <p className="text-slate-300 text-lg max-w-3xl">
          {t('roadmap.subtitle')}
        </p>
      </div>

      {/* Roadmap Content */}
      <div className="space-y-4 sm:space-y-5 md:space-y-6">
        {/* Completed */}
        <ContentPanel>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
            <h2 className="text-2xl font-bold text-white">
              {t('roadmap.completed')}
            </h2>
          </div>
          <ul className="space-y-2 sm:space-y-2.5 md:space-y-3">
            <li className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-slate-400 line-through text-sm md:text-base">
                {features[0]}
              </span>
            </li>
          </ul>
        </ContentPanel>

        {/* In Progress */}
        <ContentPanel>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-6 h-6 text-[var(--color-padel-yellow)]" />
            <h2 className="text-2xl font-bold text-white">
              {t('roadmap.inProgress')}
            </h2>
          </div>
          <ul className="space-y-2 sm:space-y-2.5 md:space-y-3">
            {features.slice(1, 5).map((feature, index) => (
              <li key={index} className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg">
                <Clock className="w-5 h-5 text-[var(--color-padel-yellow)] mt-0.5 flex-shrink-0" />
                <span className="text-white text-sm md:text-base">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </ContentPanel>

        {/* Planned */}
        <ContentPanel>
          <div className="flex items-center gap-2 mb-4">
            <Circle className="w-6 h-6 text-slate-500" />
            <h2 className="text-2xl font-bold text-white">
              {t('roadmap.planned')}
            </h2>
          </div>
          <ul className="space-y-2 sm:space-y-2.5 md:space-y-3">
            {features.slice(5).map((feature, index) => (
              <li key={index} className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg">
                <Circle className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
                <span className="text-white text-sm md:text-base">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
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
