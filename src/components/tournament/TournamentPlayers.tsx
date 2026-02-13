import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { StoredTournament } from '../../schemas/tournament'
import { getTournamentStats } from '../../utils/tournamentStats'
import { PlayerDetailCard } from '../players'

interface TournamentPlayersProps {
  tournament: StoredTournament
}

export function TournamentPlayers({ tournament }: TournamentPlayersProps) {
  const { t } = useTranslation()
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState<number>(0)

  const stats = getTournamentStats(tournament)

  if (stats.standings.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        {t('results.standings.emptyState')}
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      {/* Player Selection */}
      <div>
        <label htmlFor="player-select" className="block text-sm text-slate-400 mb-2">
          {t('results.playerDetail.selectPlayer')}
        </label>
        <select
          id="player-select"
          value={selectedPlayerIndex}
          onChange={(e) => setSelectedPlayerIndex(Number(e.target.value))}
          className="w-full pl-4 pr-10 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-padel-yellow)] focus:border-transparent transition-all min-h-[44px] sm:min-h-[46px] md:min-h-[48px]"
        >
          {stats.standings.map((standing, idx) => (
            <option key={standing.index} value={idx}>
              {standing.rank}. {standing.name}
            </option>
          ))}
        </select>
      </div>

      {/* Player Detail Card */}
      {stats.standings[selectedPlayerIndex] && (
        <PlayerDetailCard
          standing={stats.standings[selectedPlayerIndex]}
          tournament={tournament}
        />
      )}
    </div>
  )
}
