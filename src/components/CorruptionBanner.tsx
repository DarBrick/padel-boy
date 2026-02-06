import { useTranslation } from 'react-i18next'
import { AlertTriangle } from 'lucide-react'
import { useTournaments } from '../stores/tournaments'

export function CorruptionBanner() {
  const { t } = useTranslation()
  const { corruptedIds, removeCorruptedTournaments } = useTournaments()
  
  if (corruptedIds.length === 0) {
    return null
  }
  
  return (
    <div className="bg-amber-500/10 border border-amber-500/50 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-amber-500 mb-1">
            {t('pastTournaments.corruption.title')}
          </h3>
          <p className="text-slate-300 text-sm mb-3">
            {t('pastTournaments.corruption.description', { count: corruptedIds.length })}
          </p>
          <button
            onClick={removeCorruptedTournaments}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium rounded-lg transition-colors text-sm min-h-[44px]"
          >
            {t('pastTournaments.corruption.removeButton')}
          </button>
        </div>
      </div>
    </div>
  )
}
