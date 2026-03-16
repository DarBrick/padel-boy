import { type MouseEvent as ReactMouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { CircleAlert, Coffee } from 'lucide-react'
import type { StoredTournament } from '../../schemas/tournament'
import { getTotalRounds, getRoundMatches, getPausingPlayers } from '../../utils/tournamentState'
import { getTournamentStats } from '../../utils/tournamentStats'

interface RoundsHistoryProps {
  tournament: StoredTournament
  selectedPlayerIndex: number | null
  onSelectPlayerIndex: (playerIndex: number | null) => void
}

export function RoundsHistory({
  tournament,
  selectedPlayerIndex,
  onSelectPlayerIndex,
}: RoundsHistoryProps) {
  const { t } = useTranslation()
  const totalRounds = getTotalRounds(tournament)

  const handlePlayerClick = (playerIndex: number, e: ReactMouseEvent) => {
    e.stopPropagation()
    onSelectPlayerIndex(selectedPlayerIndex === playerIndex ? null : playerIndex)
  }

  if (totalRounds === 0) {
    return (
      <div className="text-center py-8 text-foreground-muted">
        {t('results.rounds.emptyState')}
      </div>
    )
  }

  return (
    <div>
      {/* Legend */}
      <div className="mb-6 sm:mb-7 md:mb-8 text-center">
        <div className="inline-flex items-center gap-2 text-sm text-foreground-muted bg-surface/40 rounded-lg px-4 py-2.5">
          <CircleAlert className="w-4 h-4 text-[var(--color-padel-yellow)]" aria-hidden="true" />
          <span>
            <strong className="font-semibold text-foreground">#N</strong>{' '}
            {t('results.rounds.legend.description')}
          </span>
        </div>
      </div>

      {Array.from({ length: totalRounds }, (_, i) => i + 1).map((roundNumber) => {
        const matches = getRoundMatches(tournament, roundNumber)
        const pausingPlayerIndices = getPausingPlayers(tournament, roundNumber)
        
        // Get standings from previous round to show player ranks
        // Don't show ranks for the first round
        const rankByIndex = new Map<number, number>()
        if (roundNumber > 1) {
          const stats = getTournamentStats(tournament, roundNumber - 1)
          stats.standings.forEach(s => rankByIndex.set(s.index, s.rank))
        }

        return (
          <div key={roundNumber}>
            {/* Round header */}
            <h3 className="mb-3 text-center text-lg font-semibold text-foreground sm:mb-3.5 sm:text-xl md:mb-4">
              {t('results.rounds.round', { number: roundNumber })}
            </h3>

            {/* Matches */}
            <div className="space-y-1">
              {matches.map((match, localIndex) => {
                const team1Players = match.team1.map(playerIndex => ({
                  playerIndex,
                  name: tournament.players[playerIndex].name,
                }))
                const team2Players = match.team2.map(playerIndex => ({
                  playerIndex,
                  name: tournament.players[playerIndex].name,
                }))

                let score1: string
                let score2: string

                if (match.isFinished && match.winner !== undefined && match.scoreDelta !== undefined) {
                  const winningScore = Math.floor((tournament.pointsPerGame + match.scoreDelta) / 2)
                  const losingScore = Math.floor((tournament.pointsPerGame - match.scoreDelta) / 2)
                  score1 = String(match.winner === 0 ? winningScore : losingScore)
                  score2 = String(match.winner === 1 ? winningScore : losingScore)
                } else {
                  score1 = '—'
                  score2 = '—'
                }

                const isDraw = match.scoreDelta === 0
                const isTeam1Winner = match.isFinished && match.winner === 0 && !isDraw
                const isTeam2Winner = match.isFinished && match.winner === 1 && !isDraw

                return (
                  <div key={localIndex} className="flex items-center text-base text-foreground-muted py-1 gap-3 sm:gap-4">
                    {/* Team 1 - flexible width, right-aligned */}
                    <div className="flex-1 text-right space-y-0.5 min-w-0">
                      {team1Players.map(({ playerIndex, name }) => {
                        const rank = rankByIndex.get(playerIndex)
                        const displayName = rank !== undefined ? `${name} (#${rank})` : name
                        return (
                          <div 
                            key={playerIndex}
                            onClick={(e) => handlePlayerClick(playerIndex, e)}
                            className={`cursor-pointer transition-colors truncate rounded-md px-1.5 py-0.5 ${
                              selectedPlayerIndex === playerIndex
                                ? 'bg-padel-500/20 text-foreground font-semibold' 
                                : 'hover:text-foreground'
                            }`}
                          >
                            {displayName}
                          </div>
                        )
                      })}
                    </div>

                    {/* Score - fixed width, always centered */}
                    <span className="flex-shrink-0 w-12 sm:w-14 flex items-center gap-1 justify-center">
                      <span className={isTeam1Winner ? 'text-padel-500 font-semibold' : 'text-foreground-muted'}>
                        {score1}
                      </span>
                      <span className="text-foreground-muted">:</span>
                      <span className={isTeam2Winner ? 'text-padel-500 font-semibold' : 'text-foreground-muted'}>
                        {score2}
                      </span>
                    </span>

                    {/* Team 2 - flexible width, left-aligned */}
                    <div className="flex-1 text-left space-y-0.5 min-w-0">
                      {team2Players.map(({ playerIndex, name }) => {
                        const rank = rankByIndex.get(playerIndex)
                        const displayName = rank !== undefined ? `${name} (#${rank})` : name
                        return (
                          <div 
                            key={playerIndex}
                            onClick={(e) => handlePlayerClick(playerIndex, e)}
                            className={`cursor-pointer transition-colors truncate rounded-md px-1.5 py-0.5 ${
                              selectedPlayerIndex === playerIndex
                                ? 'bg-padel-500/20 text-foreground font-semibold' 
                                : 'hover:text-foreground'
                            }`}
                          >
                            {displayName}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pausing players */}
            {pausingPlayerIndices.length > 0 && (
              <div className="flex justify-center mt-3">
                <div className="inline-flex items-center gap-2 text-sm text-foreground-muted bg-surface/40 rounded-lg p-3">
                  <Coffee className="w-4 h-4 text-foreground-muted" />
                  <span className="text-foreground-muted">{t('results.rounds.pausing')}:</span>
                  <span className="flex flex-wrap gap-x-1">
                    {pausingPlayerIndices.map((idx, i) => {
                      const name = tournament.players[idx].name
                      const rank = rankByIndex.get(idx)
                      const displayName = rank !== undefined ? `${name} (#${rank})` : name
                      return (
                        <span key={idx}>
                          <span
                            onClick={(e) => handlePlayerClick(idx, e)}
                            className={`inline-block cursor-pointer transition-colors rounded-md px-1.5 py-0.5 ${
                              selectedPlayerIndex === idx
                                ? 'bg-padel-500/20 text-foreground font-semibold' 
                                : 'hover:text-foreground'
                            }`}
                          >
                            {displayName}
                          </span>
                          {i < pausingPlayerIndices.length - 1 && ','}
                        </span>
                      )
                    })}
                  </span>
                </div>
              </div>
            )}

            {/* Divider between rounds */}
            {roundNumber < totalRounds && (
              <hr className="my-6 sm:my-7 md:my-8 border-t border-border" />
            )}
          </div>
        )
      })}
    </div>
  )
}
