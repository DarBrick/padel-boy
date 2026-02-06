import { useTranslation } from 'react-i18next'
import { Eye, Share2, Trash2, Users, Calendar, ClockCheck } from 'lucide-react'
import type { StoredTournament } from '../schemas/tournament'
import { extractTimestampFromId } from '../utils/tournamentId'
import { formatRelativeDate } from '../utils/dateGrouping'

interface TournamentCardProps {
  tournament: StoredTournament
  onView: (id: string) => void
  onShare: (tournament: StoredTournament) => void
  onDelete: (id: string) => void
}

export function TournamentCard({ tournament, onView, onShare, onDelete }: TournamentCardProps) {
  const { t } = useTranslation()
  
  const date = extractTimestampFromId(tournament.id)
  const dateStr = formatRelativeDate(date, t)
  
  // Get tournament status (finished if all matches are done)
  const totalMatches = tournament.matches.length
  const finishedMatches = tournament.matches.filter(m => m.isFinished).length
  const status = finishedMatches === totalMatches && totalMatches > 0 ? 'finished' :
    finishedMatches > 0 ? 'playing' : 'setup'

  // Completed rounds (consecutive from the beginning)
  const matchesPerRound = tournament.numberOfCourts
  const totalRounds = totalMatches > 0 ? Math.ceil(totalMatches / matchesPerRound) : 0
  let completedRounds = 0
  for (let roundIndex = 0; roundIndex < totalRounds; roundIndex++) {
    const start = roundIndex * matchesPerRound
    const end = start + matchesPerRound
    const roundMatches = tournament.matches.slice(start, end)
    if (roundMatches.length === 0) break
    const roundComplete = roundMatches.every(m => m.isFinished)
    if (!roundComplete) break
    completedRounds++
  }

  // Player points from finished matches (team score added to both players)
  const pointsByPlayerIndex = new Array(tournament.players.length).fill(0)
  for (const match of tournament.matches) {
    if (!match.isFinished || match.winner === undefined || match.scoreDelta === undefined) continue

    const losingScore = tournament.pointsPerGame - match.scoreDelta
    const team1Score = match.winner === 0 ? tournament.pointsPerGame : losingScore
    const team2Score = match.winner === 1 ? tournament.pointsPerGame : losingScore

    for (const playerIndex of match.team1) {
      pointsByPlayerIndex[playerIndex] += team1Score
    }
    for (const playerIndex of match.team2) {
      pointsByPlayerIndex[playerIndex] += team2Score
    }
  }

  const sortedPlayers = tournament.players
    .map((player, index) => ({ name: player.name, index, points: pointsByPlayerIndex[index] }))
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points
      return a.name.localeCompare(b.name)
    })

  const topPlayers = sortedPlayers.slice(0, 3)
  const remainingPlayers = Math.max(0, sortedPlayers.length - 3)
  
  // Format badge
  const formatBadgeColor = tournament.format === 'americano' 
    ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' 
    : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    
  const statusBadgeColor = status === 'finished' 
    ? 'bg-green-500/20 text-green-300 border-green-500/30'
    : status === 'playing'
    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    : 'bg-slate-500/20 text-slate-300 border-slate-500/30'
  
  return (
    <div className="bg-slate-800/50 border border-slate-700 hover:border-slate-600 rounded-lg p-4 transition-all">
      {/* Header with name and date */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white truncate">
            {tournament.name || t('pastTournaments.defaultName', { date: dateStr })}
          </h3>
          <div className="flex items-center gap-1.5 text-sm text-slate-400 mt-1">
            <Calendar className="w-4 h-4" />
            <span>{dateStr}</span>
          </div>
        </div>
        
        {/* Status badge */}
        <span className={`px-2.5 py-1 text-xs font-medium rounded border ${statusBadgeColor} whitespace-nowrap`}>
          {t(`pastTournaments.status.${status}`)}
        </span>
      </div>
      
      {/* Meta info */}
      <div className="flex items-center gap-4 mb-3 text-sm text-slate-300">
        {/* Format badge */}
        <span className={`px-2.5 py-1 rounded border ${formatBadgeColor} font-medium`}>
          {tournament.format === 'americano' ? 'Americano' : 'Mexicano'}
        </span>
        
        {/* Player count */}
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4" />
          <span>{tournament.playerCount}</span>
        </div>
        
        {/* Round progress */}
        <div className="flex items-center gap-1.5">
          <ClockCheck className="w-4 h-4" />
          <span>{completedRounds}/{totalRounds}</span>
        </div>
      </div>
      
      {/* Top players */}
      {topPlayers.length > 0 && (
        <div className="mb-4 text-sm">
          <span className="text-slate-400">{t('pastTournaments.players')}: </span>
          <span className="text-slate-300">
            {topPlayers.map((player, index) => {
              const medalEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'

              return (
                <span key={player.index}>
                  <span className="inline-flex items-center gap-1">
                    <span aria-hidden="true">{medalEmoji}</span>
                    <span>{player.name}</span>
                  </span>
                  {index < topPlayers.length - 1 ? ', ' : ''}
                </span>
              )
            })}
            {remainingPlayers > 0 && (
              <span className="text-slate-400"> +{remainingPlayers}</span>
            )}
          </span>
        </div>
      )}
      
      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onView(tournament.id)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-200 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors min-h-[44px]"
        >
          <Eye className="w-4 h-4" />
          {t('pastTournaments.actions.view')}
        </button>
        
        <button
          onClick={() => onShare(tournament)}
          className="flex items-center justify-center px-3 py-2 text-sm text-slate-300 hover:text-[var(--color-padel-yellow)] bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors min-h-[44px]"
          title={t('pastTournaments.actions.share')}
        >
          <Share2 className="w-5 h-5" />
        </button>
        
        <button
          onClick={() => onDelete(tournament.id)}
          className="flex items-center justify-center px-3 py-2 text-sm text-slate-300 hover:text-red-400 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors min-h-[44px]"
          title={t('pastTournaments.actions.delete')}
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
