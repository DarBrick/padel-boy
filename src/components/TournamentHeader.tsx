import { useTranslation } from 'react-i18next'
import type { TournamentStats } from '../utils/tournamentStats'
import type { StoredTournament } from '../schemas/tournament'
import { formatTournamentDate } from '../utils/tournamentState'

interface TournamentHeaderProps {
  tournament: StoredTournament
  stats: TournamentStats
}

export function TournamentHeader({ tournament, stats }: TournamentHeaderProps) {
  const { t } = useTranslation()
  const tournamentDate = formatTournamentDate(tournament)

  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
        {tournament.name || t('tournament.title')}
      </h1>

      {/* Tournament Info Badges */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="px-3 py-1 bg-[var(--color-padel-yellow)]/20 text-[var(--color-padel-yellow)] rounded-full text-sm font-semibold border border-[var(--color-padel-yellow)]/30">
          {t(`tournament.format.${tournament.format}`)}
        </span>
        
        <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${
          stats.status === 'playing'
            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
            : 'bg-slate-500/20 text-slate-300 border-slate-500/30'
        }`}>
          {t(`pastTournaments.status.${stats.status}`)}
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
  )
}
