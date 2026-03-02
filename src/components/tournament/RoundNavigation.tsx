import { useTranslation } from 'react-i18next'
import { ArrowLeft, ArrowRight, ArrowRightToLine, ChevronDown } from 'lucide-react'

interface RoundNavigationProps {
  currentRound: number
  totalRounds: number
  isLastRound: boolean
  isTournamentFinished: boolean
  onPreviousRound: () => void
  onNextRound: () => void
  onJumpToLast: () => void
  onRoundSelect: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

export function RoundNavigation({
  currentRound,
  totalRounds,
  isLastRound,
  isTournamentFinished,
  onPreviousRound,
  onNextRound,
  onJumpToLast,
  onRoundSelect,
}: RoundNavigationProps) {
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {/* Previous Round Button */}
      <button
        onClick={onPreviousRound}
        disabled={currentRound <= 1}
        className="flex items-center justify-center px-3 py-2 text-sm text-foreground-muted hover:text-padel-500 bg-surface hover:bg-surface-muted rounded-lg transition-colors min-h-[44px] sm:min-h-[46px] md:min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-foreground-muted disabled:hover:bg-surface"
        aria-label={t('tournament.previousRound')}
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      {/* Round Selector */}
      <div className="relative flex-1">
        <select
          value={currentRound}
          onChange={onRoundSelect}
          className={`w-full appearance-none font-bold text-base sm:text-lg px-3 sm:px-4 py-2 pr-10 rounded-lg focus:outline-none transition-colors cursor-pointer min-h-[44px] sm:min-h-[46px] md:min-h-[48px] ${
            isLastRound && !isTournamentFinished
              ? 'bg-surface border-2 border-padel-500 text-padel-500 hover:bg-surface-muted'
              : 'bg-surface border border-border text-foreground-muted hover:bg-surface-muted hover:border-foreground-muted'
          }`}
        >
          {Array.from({ length: totalRounds }, (_, i) => i + 1).map((round) => (
            <option key={round} value={round}>
              {t('tournament.round', { current: round })}
            </option>
          ))}
        </select>
        <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none ${
          isLastRound && !isTournamentFinished ? 'text-padel-500' : 'text-foreground-muted'
        }`} />
      </div>

      {/* Next Round Button */}
      {currentRound < totalRounds && (
        <button
          onClick={onNextRound}
          className="flex items-center justify-center px-3 py-2 text-sm text-foreground-muted hover:text-padel-500 bg-surface hover:bg-surface-muted rounded-lg transition-colors min-h-[44px] sm:min-h-[46px] md:min-h-[48px]"
          aria-label={t('tournament.nextRound')}
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      )}

      {/* Jump to Last Round Button */}
      {currentRound < totalRounds && (
        <button
          onClick={onJumpToLast}
          className="flex items-center justify-center px-3 py-2 text-sm text-foreground-muted hover:text-padel-500 bg-surface hover:bg-surface-muted rounded-lg transition-colors min-h-[44px] sm:min-h-[46px] md:min-h-[48px]"
          aria-label={t('tournament.lastRound')}
        >
          <ArrowRightToLine className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}
