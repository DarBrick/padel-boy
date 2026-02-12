import { useTranslation } from 'react-i18next'
import { GradientButton } from './GradientButton'

interface TournamentActionsProps {
  isLastRound: boolean
  isTournamentFinished: boolean
  allMatchesFinished: boolean
  hasMatches: boolean
  remainingMatches: number
  isGenerating: boolean
  onFinishTournament: () => void
  onGenerateNextRound: () => void
}

export function TournamentActions({
  isLastRound,
  isTournamentFinished,
  allMatchesFinished,
  hasMatches,
  remainingMatches,
  isGenerating,
  onFinishTournament,
  onGenerateNextRound,
}: TournamentActionsProps) {
  const { t } = useTranslation()

  if (!hasMatches || !isLastRound || isTournamentFinished) {
    return null
  }

  // Show remaining matches info if not all matches are finished
  if (!allMatchesFinished) {
    return (
      <div className="text-center">
        <span className="text-sm text-slate-400">
          {t('tournament.matchesRemaining', { count: remainingMatches })}
        </span>
      </div>
    )
  }

  // Show action buttons when all matches are finished
  return (
    <div className="flex gap-3">
      <button
        onClick={onFinishTournament}
        className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-lg transition-colors text-base font-medium min-h-[44px] sm:min-h-[46px] md:min-h-[48px] whitespace-nowrap"
      >
        {t('tournament.finishTournament')}
      </button>
      <GradientButton
        onClick={onGenerateNextRound}
        disabled={isGenerating}
        fullWidth
      >
        {t('tournament.generateNextRound')}
      </GradientButton>
    </div>
  )
}
