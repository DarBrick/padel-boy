import { useTranslation } from 'react-i18next'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowRightToLine, ChevronDown, Play, Coffee } from 'lucide-react'
import { useTournaments } from '../stores/tournaments'
import { getTournamentStats } from '../utils/tournamentStats'
import { generateNextRound } from '../utils/roundGenerator'
import {
  getTotalRounds,
  getRoundMatches,
  isRoundComplete,
  getRemainingMatchCount,
  isLastRound as checkIsLastRound,
  isTournamentFinished as checkIsTournamentFinished,
  canGenerateNextRound,
  updateMatch,
  appendRoundMatches,
  finishTournament,
  formatTournamentDate,
  parseRoundParam,
  toGlobalMatchIndex,
  getPausingPlayers,
} from '../utils/tournamentState'
import { IconButton } from '../components/IconButton'
import { ContentPanel } from '../components/ContentPanel'
import { GradientButton } from '../components/GradientButton'
import { MatchCard } from '../components/MatchCard'
import type { StoredMatch } from '../schemas/tournament'

export function Tournament() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { getTournament, updateTournament } = useTournaments()
  
  const [tournament, setTournament] = useState(() => getTournament(id!))
  const [isGenerating, setIsGenerating] = useState(false)

  // Auto-generate first round if no matches exist
  useEffect(() => {
    if (!tournament || tournament.matches.length > 0) return

    const newMatches = generateNextRound(tournament)
    if (newMatches.length > 0) {
      const updatedTournament = {
        ...tournament,
        matches: newMatches,
      }
      updateTournament(updatedTournament)
      setTournament(updatedTournament)
    }
  }, []) // Only run on mount

  // Sync tournament state with store changes
  useEffect(() => {
    const updated = getTournament(id!)
    if (updated) {
      setTournament(updated)
    }
  }, [id, getTournament])

  // Validate and update round query param
  useEffect(() => {
    if (!tournament || tournament.matches.length === 0) return

    const roundParam = searchParams.get('round')
    const validRound = parseRoundParam(tournament, roundParam)
    
    if (!roundParam || validRound.toString() !== roundParam) {
      setSearchParams({ round: validRound.toString() }, { replace: true })
    }
  }, [tournament, searchParams, setSearchParams])

  // Handle tournament not found
  if (!tournament) {
    return (
      <div className="space-y-6 sm:space-y-7 md:space-y-8">
        <div>
          <div className="flex items-center gap-4">
            <IconButton onClick={() => navigate('/')} label={t('tournament.backToHome')} />
            <h1 className="text-3xl font-bold">{t('tournament.notFound')}</h1>
          </div>
        </div>
        <ContentPanel>
          <p className="text-slate-400">{t('tournament.notFoundDesc')}</p>
        </ContentPanel>
      </div>
    )
  }

  const stats = getTournamentStats(tournament)
  const totalAvailableRounds = getTotalRounds(tournament)
  const currentRound = parseRoundParam(tournament, searchParams.get('round'))
  const currentRoundMatches = getRoundMatches(tournament, currentRound)
  const allCurrentMatchesFinished = isRoundComplete(tournament, currentRound)
  const remainingMatches = getRemainingMatchCount(tournament, currentRound)
  const isLastRound = checkIsLastRound(tournament, currentRound)
  const isTournamentFinished = checkIsTournamentFinished(tournament)
  const pausingPlayerIndices = getPausingPlayers(tournament, currentRound)

  // Handle round navigation
  function handleRoundChange(newRound: number) {
    if (newRound >= 1 && newRound <= totalAvailableRounds) {
      setSearchParams({ round: newRound.toString() })
    }
  }

  function handlePreviousRound() {
    if (currentRound > 1) {
      handleRoundChange(currentRound - 1)
    }
  }

  function handleNextRound() {
    if (currentRound < totalAvailableRounds) {
      handleRoundChange(currentRound + 1)
    }
  }

  function handleJumpToLast() {
    handleRoundChange(totalAvailableRounds)
  }

  function handleRoundSelect(event: React.ChangeEvent<HTMLSelectElement>) {
    const newRound = parseInt(event.target.value, 10)
    handleRoundChange(newRound)
  }

  // Handle match update
  function handleUpdateMatch(matchIndex: number, updatedMatch: StoredMatch) {
    if (!tournament) return
    const updatedTournament = updateMatch(tournament, currentRound, matchIndex, updatedMatch)
    updateTournament(updatedTournament)
    setTournament(updatedTournament)
  }

  // Handle generate next round
  function handleGenerateNextRound() {
    if (!tournament || !canGenerateNextRound(tournament, currentRound)) return

    setIsGenerating(true)
    
    const newMatches = generateNextRound(tournament)
    
    if (newMatches.length === 0) {
      setIsGenerating(false)
      return
    }

    const updatedTournament = appendRoundMatches(tournament, newMatches)
    updateTournament(updatedTournament)
    setTournament(updatedTournament)
    
    const newRoundNumber = getTotalRounds(updatedTournament)
    setSearchParams({ round: newRoundNumber.toString() })
    
    setIsGenerating(false)
  }

  // Handle finish tournament
  function handleFinishTournament() {
    if (!tournament || isTournamentFinished) return

    const updatedTournament = finishTournament(tournament)
    updateTournament(updatedTournament)
    setTournament(updatedTournament)
  }

  const tournamentDate = formatTournamentDate(tournament)

  return (
    <div className="space-y-6 sm:space-y-7 md:space-y-8">
      {/* Header */}
      <div>
        <div className="mb-6">
          <IconButton onClick={() => navigate('/')} label={t('tournament.backToHome')} />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {tournament.name || t('tournament.title')}
        </h1>

        {/* Tournament Info Badges */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="px-3 py-1 bg-[var(--color-padel-yellow)]/20 text-[var(--color-padel-yellow)] rounded-full text-sm font-semibold border border-[var(--color-padel-yellow)]/30">
            {t(`tournament.format.${tournament.format}`)}
          </span>
          
          <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${
            isTournamentFinished || stats.status === 'finished'
              ? 'bg-green-500/20 text-green-300 border-green-500/30'
              : stats.status === 'playing'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              : 'bg-slate-500/20 text-slate-300 border-slate-500/30'
          }`}>
            {isTournamentFinished 
              ? t('pastTournaments.status.finished')
              : t(`pastTournaments.status.${stats.status}`)}
          </span>

          <span className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-full text-sm font-medium">
            {tournament.playerCount} {t('tournament.players')}
          </span>

          {tournament.format === 'mexicano' && tournament.mexicanoMatchupStyle && (
            <span className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-full text-sm font-medium">
              {t('tournament.pairingStyle')}: {tournament.mexicanoMatchupStyle}
            </span>
          )}

          {tournamentDate && (
            <span className="px-3 py-1 bg-slate-700/50 text-slate-400 rounded-full text-sm font-medium">
              {tournamentDate}
            </span>
          )}
        </div>
      </div>

      {/* Round Navigation */}
      {currentRoundMatches.length > 0 && totalAvailableRounds > 0 && (
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Previous Round Button */}
          <button
            onClick={handlePreviousRound}
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
              onChange={handleRoundSelect}
              className={`w-full appearance-none font-bold text-base sm:text-lg px-3 sm:px-4 py-2 pr-10 rounded-lg focus:outline-none transition-colors cursor-pointer min-h-[44px] sm:min-h-[46px] md:min-h-[48px] ${
                isLastRound && !isTournamentFinished
                  ? 'bg-slate-700 border-2 border-[var(--color-padel-yellow)] text-[var(--color-padel-yellow)] hover:bg-slate-600'
                  : 'bg-slate-700 border border-slate-600 text-slate-300 hover:bg-slate-600 hover:border-slate-500'
              }`}
            >
              {Array.from({ length: totalAvailableRounds }, (_, i) => i + 1).map((round) => (
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
          {currentRound < totalAvailableRounds && (
            <button
              onClick={handleNextRound}
              className="flex items-center justify-center px-3 py-2 text-sm text-slate-300 hover:text-[var(--color-padel-yellow)] bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors min-h-[44px] sm:min-h-[46px] md:min-h-[48px]"
              aria-label={t('tournament.nextRound')}
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          )}

          {/* Jump to Last Round Button */}
          {currentRound < totalAvailableRounds && (
            <button
              onClick={handleJumpToLast}
              className="flex items-center justify-center px-3 py-2 text-sm text-slate-300 hover:text-[var(--color-padel-yellow)] bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors min-h-[44px] sm:min-h-[46px] md:min-h-[48px]"
              aria-label={t('tournament.lastRound')}
            >
              <ArrowRightToLine className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      {/* Matches Section Header */}
      {currentRoundMatches.length > 0 && (
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
      )}

      {/* Pausing Players */}
      {pausingPlayerIndices.length > 0 && currentRoundMatches.length > 0 && (
        <div className="flex items-center gap-3 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
          <Coffee className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <div className="flex-1">
            <div className="text-sm font-medium text-slate-300 mb-1">
              {t('tournament.pausingPlayers')}
            </div>
            <div className="flex flex-wrap gap-2">
              {pausingPlayerIndices.map(playerIndex => (
                <span
                  key={playerIndex}
                  className="px-2.5 py-1 bg-slate-700 text-slate-300 rounded-md text-sm"
                >
                  {tournament.players[playerIndex].name}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Matches Grid */}
      {currentRoundMatches.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          {currentRoundMatches.map((match, index) => {
            const courtNumber = index + 1
            const courtName = tournament.courtNames?.[index]
            const globalIndex = toGlobalMatchIndex(tournament, currentRound, index)

            return (
              <MatchCard
                key={globalIndex}
                match={match}
                courtNumber={courtNumber}
                courtName={courtName}
                playerNames={tournament.players.map(p => p.name)}
                pointsPerGame={tournament.pointsPerGame}
                onUpdateMatch={(updatedMatch) => handleUpdateMatch(index, updatedMatch)}
                readonly={!isLastRound || isTournamentFinished}
              />
            )
          })}
        </div>
      )}

      {/* Remaining Matches Info - Only for last round */}
      {isLastRound && !isTournamentFinished && !allCurrentMatchesFinished && currentRoundMatches.length > 0 && (
        <div className="text-center">
          <span className="text-sm text-slate-400">
            {t('tournament.matchesRemaining', { count: remainingMatches })}
          </span>
        </div>
      )}

      {/* Generate Next Round Button - Only for last round */}
      {isLastRound && !isTournamentFinished && allCurrentMatchesFinished && currentRoundMatches.length > 0 && (
        <div className="flex gap-3">
          <button
            onClick={handleFinishTournament}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-lg transition-colors text-base font-medium min-h-[44px] sm:min-h-[46px] md:min-h-[48px] whitespace-nowrap"
          >
            {t('tournament.finishTournament')}
          </button>
          <GradientButton
            onClick={handleGenerateNextRound}
            disabled={isGenerating}
            fullWidth
          >
            {t('tournament.generateNextRound')}
          </GradientButton>
        </div>
      )}
    </div>
  )
}

