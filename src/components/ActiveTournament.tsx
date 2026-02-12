import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
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
  parseRoundParam,
  getPausingPlayers,
} from '../utils/tournamentState'
import { IconButton } from './IconButton'
import { ContentPanel } from './ContentPanel'
import { TournamentHeader } from './TournamentHeader'
import { RoundNavigation } from './RoundNavigation'
import { MatchesSectionHeader } from './MatchesSectionHeader'
import { PausingPlayersPanel } from './PausingPlayersPanel'
import { MatchesGrid } from './MatchesGrid'
import { TournamentActions } from './TournamentActions'
import type { StoredTournament, StoredMatch } from '../schemas/tournament'

interface ActiveTournamentProps {
  initialTournament: StoredTournament
}

export function ActiveTournament({ initialTournament }: ActiveTournamentProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { getTournament, updateTournament } = useTournaments()
  
  const [tournament, setTournament] = useState(initialTournament)
  const [isGenerating, setIsGenerating] = useState(false)

  // Auto-generate first round if no matches exist
  useEffect(() => {
    if (tournament.matches.length > 0) return

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
    const updated = getTournament(tournament.id)
    if (updated) {
      setTournament(updated)
    }
  }, [tournament.id, getTournament])

  // Validate and update round query param
  useEffect(() => {
    if (tournament.matches.length === 0) return

    const roundParam = searchParams.get('round')
    const validRound = parseRoundParam(tournament, roundParam)
    
    if (!roundParam || validRound.toString() !== roundParam) {
      setSearchParams({ round: validRound.toString() }, { replace: true })
    }
  }, [tournament, searchParams, setSearchParams])

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
    const updatedTournament = updateMatch(tournament, currentRound, matchIndex, updatedMatch)
    updateTournament(updatedTournament)
    setTournament(updatedTournament)
  }

  // Handle generate next round
  function handleGenerateNextRound() {
    if (!canGenerateNextRound(tournament, currentRound)) return

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
    if (isTournamentFinished) return

    const updatedTournament = finishTournament(tournament)
    updateTournament(updatedTournament)
    setTournament(updatedTournament)
  }

  return (
    <div className="space-y-6 sm:space-y-7 md:space-y-8">
      {/* Back Button */}
      <div>
        <IconButton onClick={() => navigate('/')} label={t('tournament.backToHome')} />
      </div>

      {/* Tournament Header and Round Navigation */}
      <ContentPanel>
        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          <TournamentHeader tournament={tournament} stats={stats} />

          {/* Round Navigation */}
          {currentRoundMatches.length > 0 && totalAvailableRounds > 0 && (
            <RoundNavigation
              currentRound={currentRound}
              totalRounds={totalAvailableRounds}
              isLastRound={isLastRound}
              isTournamentFinished={isTournamentFinished}
              onPreviousRound={handlePreviousRound}
              onNextRound={handleNextRound}
              onJumpToLast={handleJumpToLast}
              onRoundSelect={handleRoundSelect}
            />
          )}
        </div>
      </ContentPanel>

      {/* Matches Section Header */}
      {currentRoundMatches.length > 0 && (
        <MatchesSectionHeader
          isLastRound={isLastRound}
          isTournamentFinished={isTournamentFinished}
        />
      )}

      {/* Pausing Players */}
      <PausingPlayersPanel
        pausingPlayerIndices={pausingPlayerIndices}
        players={tournament.players}
      />

      {/* Matches Grid */}
      <MatchesGrid
        tournament={tournament}
        currentRound={currentRound}
        currentRoundMatches={currentRoundMatches}
        isLastRound={isLastRound}
        isTournamentFinished={isTournamentFinished}
        onUpdateMatch={handleUpdateMatch}
      />

      {/* Tournament Actions (Remaining matches info and action buttons) */}
      <TournamentActions
        isLastRound={isLastRound}
        isTournamentFinished={isTournamentFinished}
        allMatchesFinished={allCurrentMatchesFinished}
        hasMatches={currentRoundMatches.length > 0}
        remainingMatches={remainingMatches}
        isGenerating={isGenerating}
        onFinishTournament={handleFinishTournament}
        onGenerateNextRound={handleGenerateNextRound}
      />
    </div>
  )
}
