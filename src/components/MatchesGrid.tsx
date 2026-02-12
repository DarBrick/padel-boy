import { MatchCard } from './MatchCard'
import { toGlobalMatchIndex } from '../utils/tournamentState'
import type { StoredTournament, StoredMatch } from '../schemas/tournament'

interface MatchesGridProps {
  tournament: StoredTournament
  currentRound: number
  currentRoundMatches: StoredMatch[]
  isLastRound: boolean
  isTournamentFinished: boolean
  onUpdateMatch: (matchIndex: number, updatedMatch: StoredMatch) => void
}

export function MatchesGrid({
  tournament,
  currentRound,
  currentRoundMatches,
  isLastRound,
  isTournamentFinished,
  onUpdateMatch,
}: MatchesGridProps) {
  if (currentRoundMatches.length === 0) {
    return null
  }

  return (
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
            onUpdateMatch={(updatedMatch) => onUpdateMatch(index, updatedMatch)}
            readonly={!isLastRound || isTournamentFinished}
          />
        )
      })}
    </div>
  )
}
