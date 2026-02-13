import { useTranslation } from 'react-i18next'
import { Globe, Swords, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { ContentPanel } from '../ui'

export function FormatComparisonCard() {
  const { t } = useTranslation()
  const [expandedFormat, setExpandedFormat] = useState<'americano' | 'mexicano' | null>(null)

  const toggleFormat = (format: 'americano' | 'mexicano') => {
    setExpandedFormat(expandedFormat === format ? null : format)
  }

  return (
    <ContentPanel>
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
        {t('home.formatComparison.title')}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Americano */}
        <div className="bg-slate-700/30 rounded-lg p-5 border border-blue-500/30 transition-all duration-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-500/20 p-3 rounded-lg">
              <Globe className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">
              {t('home.formatComparison.americano.title')}
            </h3>
          </div>
          
          <p className="text-slate-300 text-sm mb-4">
            {t('home.formatComparison.americano.description')}
          </p>
          
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">•</span>
              <span>{t('home.formatComparison.americano.bullet1')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">•</span>
              <span>{t('home.formatComparison.americano.bullet2')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">•</span>
              <span>{t('home.formatComparison.americano.bullet3')}</span>
            </li>
          </ul>
          
          <button
            onClick={() => toggleFormat('americano')}
            className="mt-4 flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            <span>{expandedFormat === 'americano' ? t('home.formatComparison.showLess') : t('home.formatComparison.learnMore')}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expandedFormat === 'americano' ? 'rotate-180' : ''}`} />
          </button>
          
          {expandedFormat === 'americano' && (
            <div className="mt-4 pt-4 border-t border-blue-500/20 text-sm text-slate-300 space-y-2">
              <p>{t('home.formatComparison.americano.detail1')}</p>
              <p>{t('home.formatComparison.americano.detail2')}</p>
            </div>
          )}
        </div>

        {/* Mexicano */}
        <div className="bg-slate-700/30 rounded-lg p-5 border border-purple-500/30 transition-all duration-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-500/20 p-3 rounded-lg">
              <Swords className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">
              {t('home.formatComparison.mexicano.title')}
            </h3>
          </div>
          
          <p className="text-slate-300 text-sm mb-4">
            {t('home.formatComparison.mexicano.description')}
          </p>
          
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-0.5">•</span>
              <span>{t('home.formatComparison.mexicano.bullet1')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-0.5">•</span>
              <span>{t('home.formatComparison.mexicano.bullet2')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-0.5">•</span>
              <span>{t('home.formatComparison.mexicano.bullet3')}</span>
            </li>
          </ul>
          
          <button
            onClick={() => toggleFormat('mexicano')}
            className="mt-4 flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            <span>{expandedFormat === 'mexicano' ? t('home.formatComparison.showLess') : t('home.formatComparison.learnMore')}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expandedFormat === 'mexicano' ? 'rotate-180' : ''}`} />
          </button>
          
          {expandedFormat === 'mexicano' && (
            <div className="mt-4 pt-4 border-t border-purple-500/20 text-sm text-slate-300 space-y-2">
              <p>{t('home.formatComparison.mexicano.detail1')}</p>
              <p>{t('home.formatComparison.mexicano.detail2')}</p>
            </div>
          )}
        </div>
      </div>
    </ContentPanel>
  )
}
