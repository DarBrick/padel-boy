import { useTranslation } from 'react-i18next'
import { AlertTriangle } from 'lucide-react'
import { useTournaments } from '../../stores/tournaments'

export function CorruptionBanner() {
  const { t } = useTranslation()
  const { corruptedIds, removeCorruptedTournaments } = useTournaments()
  
  if (corruptedIds.length === 0) {
    return null
  }
  
  return (
    <div className="mb-6 rounded-lg border border-amber-500/50 bg-amber-500/10 p-4 sm:p-5 md:p-6" role="alert">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="mb-1 text-base font-semibold text-amber-500 sm:text-lg">
            {t('pastTournaments.corruption.title')}
          </h3>
          <p className="text-foreground-muted text-sm mb-3">
            {t('pastTournaments.corruption.description', { count: corruptedIds.length })}
          </p>
          <button
            type="button"
            onClick={removeCorruptedTournaments}
            className="min-h-[44px] rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-amber-600 sm:min-h-[46px] md:min-h-[48px]"
          >
            {t('pastTournaments.corruption.removeButton')}
          </button>
        </div>
      </div>
    </div>
  )
}
