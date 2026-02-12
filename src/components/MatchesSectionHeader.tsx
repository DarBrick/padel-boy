import { useTranslation } from 'react-i18next'
import { Play } from 'lucide-react'

interface MatchesSectionHeaderProps {
  isLastRound: boolean
  isTournamentFinished: boolean
}

export function MatchesSectionHeader({ isLastRound, isTournamentFinished }: MatchesSectionHeaderProps) {
  const { t } = useTranslation()

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-200">
        {t('tournament.matches')}
      </h2>
      {isLastRound && !isTournamentFinished ? (
        <span className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-padel-yellow)]">
          <Play className="w-4 h-4" />
          {t('tournament.activeRound')}
        </span>
      ) : (
        <span className="text-sm text-slate-500">
          {t('tournament.completedRound')}
        </span>
      )}
    </div>
  )
}
