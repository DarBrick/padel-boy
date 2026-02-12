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
        className="flex items-center justify-center px-3 py-2 text-sm text-slate-300 hover:text-[var(--color-padel-yellow)] bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors min-h-[44px] sm:min-h-[46px] md:min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-slate-300 disabled:hover:bg-slate-700"
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
              ? 'bg-slate-700 border-2 border-[var(--color-padel-yellow)] text-[var(--color-padel-yellow)] hover:bg-slate-600'
              : 'bg-slate-700 border border-slate-600 text-slate-300 hover:bg-slate-600 hover:border-slate-500'
          }`}
        >
          {Array.from({ length: totalRounds }, (_, i) => i + 1).map((round) => (
            <option key={round} value={round}>
              {t('tournament.round', { current: round })}
            </option>
          ))}
        </select>
        <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none ${
          isLastRound && !isTournamentFinished ? 'text-[var(--color-padel-yellow)]' : 'text-slate-400'
        }`} />
      </div>

      {/* Next Round Button */}
      {currentRound < totalRounds && (
        <button
          onClick={onNextRound}
          className="flex items-center justify-center px-3 py-2 text-sm text-slate-300 hover:text-[var(--color-padel-yellow)] bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors min-h-[44px] sm:min-h-[46px] md:min-h-[48px]"
          aria-label={t('tournament.nextRound')}
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      )}

      {/* Jump to Last Round Button */}
      {currentRound < totalRounds && (
        <button
          onClick={onJumpToLast}
          className="flex items-center justify-center px-3 py-2 text-sm text-slate-300 hover:text-[var(--color-padel-yellow)] bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors min-h-[44px] sm:min-h-[46px] md:min-h-[48px]"
          aria-label={t('tournament.lastRound')}
        >
          <ArrowRightToLine className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}
