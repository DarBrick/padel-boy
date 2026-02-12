import { useTranslation } from 'react-i18next'
import { Coffee } from 'lucide-react'
import type { StoredTournament } from '../schemas/tournament'
import { getTotalRounds, getRoundMatches, getPausingPlayers } from '../utils/tournamentState'

interface RoundsHistoryProps {
  tournament: StoredTournament
}

export function RoundsHistory({ tournament }: RoundsHistoryProps) {
  const { t } = useTranslation()
  const totalRounds = getTotalRounds(tournament)

  if (totalRounds === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        {t('results.rounds.emptyState')}
      </div>
    )
  }

  return (
    <div>
      {Array.from({ length: totalRounds }, (_, i) => i + 1).map((roundNumber) => {
        const matches = getRoundMatches(tournament, roundNumber)
        const pausingPlayerIndices = getPausingPlayers(tournament, roundNumber)

        return (
          <div key={roundNumber}>
            {/* Round header */}
            <h3 className="text-lg font-semibold text-white mb-3 sm:mb-3.5 md:mb-4 text-center">
              {t('results.rounds.round', { number: roundNumber })}
            </h3>

            {/* Matches */}
            <div className="space-y-1">
              {matches.map((match, localIndex) => {
                const team1Names = match.team1.map(idx => tournament.players[idx].name)
                const team2Names = match.team2.map(idx => tournament.players[idx].name)

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
                  <div key={localIndex} className="grid grid-cols-[1fr_auto_1fr] gap-6 sm:gap-8 md:gap-10 items-center text-base text-slate-300 py-1">
                    <div className="text-right space-y-0.5">
                      {team1Names.map((name, idx) => (
                        <div key={idx}>{name}</div>
                      ))}
                    </div>
                    <span className="flex-shrink-0 flex items-center gap-1 justify-center">
                      <span className={isTeam1Winner ? 'text-[var(--color-padel-yellow)] font-semibold' : 'text-slate-500'}>
                        {score1}
                      </span>
                      <span className="text-slate-500">:</span>
                      <span className={isTeam2Winner ? 'text-[var(--color-padel-yellow)] font-semibold' : 'text-slate-500'}>
                        {score2}
                      </span>
                    </span>
                    <div className="text-left space-y-0.5">
                      {team2Names.map((name, idx) => (
                        <div key={idx}>{name}</div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pausing players */}
            {pausingPlayerIndices.length > 0 && (
              <div className="flex justify-center mt-3">
                <div className="inline-flex items-center gap-2 text-sm text-slate-300 bg-slate-800/30 rounded-lg p-3">
                  <Coffee className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-400">{t('results.rounds.pausing')}:</span>
                  <span>
                    {pausingPlayerIndices.map(idx => tournament.players[idx].name).join(', ')}
                  </span>
                </div>
              </div>
            )}

            {/* Divider between rounds */}
            {roundNumber < totalRounds && (
              <hr className="my-6 sm:my-7 md:my-8 border-t border-slate-700" />
            )}
          </div>
        )
      })}
    </div>
  )
}
