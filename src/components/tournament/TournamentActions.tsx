import { useTranslation } from 'react-i18next'
import { GradientButton } from '../ui'

interface TournamentActionsProps {
  isLastRound: boolean
  isTournamentFinished: boolean
  allMatchesFinished: boolean
  hasMatches: boolean
  remainingMatches: number
  isGenerating: boolean
  canFinish: boolean
  canDiscardRound: boolean
  onFinishTournament: () => void
  onGenerateNextRound: () => void
  onDiscardCurrentRound: () => void
}

export function TournamentActions({
  isLastRound,
  isTournamentFinished,
  allMatchesFinished,
  hasMatches,
  remainingMatches,
  isGenerating,
  canFinish,
  canDiscardRound,
  onFinishTournament,
  onGenerateNextRound,
  onDiscardCurrentRound,
}: TournamentActionsProps) {
  const { t } = useTranslation()

  if (!hasMatches || !isLastRound || isTournamentFinished) {
    return null
  }

  // Show action buttons when can finish (either all matches done or scenario B)
  if (canFinish) {
    return (
      <div className="space-y-3">
        {allMatchesFinished && (
          <GradientButton
            onClick={onGenerateNextRound}
            disabled={isGenerating}
            fullWidth
          >
            {t('tournament.generateNextRound')}
          </GradientButton>
        )}
        {canDiscardRound && (
          <div className="space-y-2">
            <button
              onClick={onDiscardCurrentRound}
              className="w-full px-6 py-3 bg-surface hover:bg-surface-muted text-foreground-muted hover:text-foreground rounded-lg transition-colors text-base font-medium min-h-[44px] sm:min-h-[46px] md:min-h-[48px]"
            >
              {t('tournament.discardRound')}
            </button>
            <p className="text-center text-sm text-foreground-muted">
              {t('tournament.discardRoundHelper')}
            </p>
          </div>
        )}
        <button
          onClick={onFinishTournament}
          className="w-full px-6 py-3 bg-surface hover:bg-surface-muted text-foreground-muted hover:text-foreground rounded-lg transition-colors text-base font-medium min-h-[44px] sm:min-h-[46px] md:min-h-[48px]"
        >
          {t('tournament.finishTournament')}
        </button>
      </div>
    )
  }

  // Show remaining matches info if not able to finish
  return (
    <div className="text-center">
      <span className="text-sm text-foreground-muted">
        {t('tournament.matchesRemaining', { count: remainingMatches })}
      </span>
    </div>
  )
}
