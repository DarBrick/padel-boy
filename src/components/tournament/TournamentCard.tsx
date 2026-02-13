import { useTranslation } from 'react-i18next'
import { Eye, Share2, Trash2, Users, Calendar, Repeat2 } from 'lucide-react'
import type { StoredTournament } from '../../schemas/tournament'
import { extractTimestampFromId } from '../../utils/tournamentId'
import { formatRelativeDate } from '../../utils/dateGrouping'
import { getTournamentStats } from '../../utils/tournamentStats'
import { ContentPanel } from '../ui'

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
  
  // Get all tournament statistics in one call
  const stats = getTournamentStats(tournament)
  const { status, totalRounds, topPlayers, standings } = stats
  const remainingPlayers = Math.max(0, standings.length - 3)
  
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
    <ContentPanel className="p-4 md:p-4 transition-all">
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
      <div className="flex items-center gap-2 mb-3 text-sm text-slate-300 flex-wrap">
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
          <Repeat2 className="w-4 h-4" />
          <span>{status === 'setup' ? '0' : totalRounds}</span>
        </div>
      </div>
      
      {/* Top players */}
      {topPlayers.length > 0 && (
        <div className="mb-4 text-sm">
          <span className="text-slate-400">{t('pastTournaments.players')}: </span>
          <span className="text-slate-300">
            {topPlayers.map((player, index) => {
              const medalEmoji = player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : '🥉'

              return (
                <span key={player.index}>
                  <span className="inline-flex items-center gap-1">
                    {status !== 'setup' && <span aria-hidden="true">{medalEmoji}</span>}
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
          {status === 'finished' 
            ? t('pastTournaments.actions.viewResults')
            : status === 'playing'
            ? t('pastTournaments.actions.continue')
            : t('pastTournaments.actions.view')}
        </button>
        
        <button
          onClick={() => onShare(tournament)}
          disabled={status !== 'finished'}
          className="flex items-center justify-center px-3 py-2 text-sm text-slate-300 hover:text-[var(--color-padel-yellow)] bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-slate-300 disabled:hover:bg-slate-700"
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
    </ContentPanel>
  )
}
