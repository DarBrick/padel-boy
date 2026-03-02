import { useTranslation } from 'react-i18next'
import { ChevronDown } from 'lucide-react'
import type { StoredTournament } from '../../schemas/tournament'
import { getTournamentStats } from '../../utils/tournamentStats'
import { PlayerDetailCard } from '../players'

interface TournamentPlayersProps {
  tournament: StoredTournament
  selectedPlayerIndex: number | null
  onSelectPlayerIndex: (playerIndex: number | null) => void
}

export function TournamentPlayers({
  tournament,
  selectedPlayerIndex,
  onSelectPlayerIndex,
}: TournamentPlayersProps) {
  const { t } = useTranslation()

  const stats = getTournamentStats(tournament)

  if (stats.standings.length === 0) {
    return (
      <div className="text-center py-8 text-foreground-muted">
        {t('results.standings.emptyState')}
      </div>
    )
  }

  const defaultPlayerIndex = stats.standings[0].index
  const activePlayerIndex = selectedPlayerIndex ?? defaultPlayerIndex
  const activeStanding = stats.standings.find((standing) => standing.index === activePlayerIndex)

  return (
    <div className="space-y-6 sm:space-y-7 md:space-y-8">
      {/* Player Selection */}
      <div className="space-y-2.5 sm:space-y-3">
        <label htmlFor="player-select" className="block text-sm text-foreground-muted">
          {t('results.playerDetail.selectPlayer')}
        </label>
        <div className="relative">
          <select
            id="player-select"
            value={activePlayerIndex}
            onChange={(e) => onSelectPlayerIndex(Number(e.target.value))}
            className="w-full appearance-none pl-4 pr-12 py-3 bg-surface border-2 border-padel-500/50 rounded-lg text-foreground text-base focus:outline-none focus:ring-2 focus:ring-padel-500 focus:border-padel-500 transition-all min-h-[44px] sm:min-h-[46px] md:min-h-[48px]"
          >
            {stats.standings.map((standing) => (
              <option key={standing.index} value={standing.index}>
                {standing.rank}. {standing.name}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Player Detail Card */}
      {activeStanding && (
        <section className="space-y-3 sm:space-y-3.5 md:space-y-4 pt-1">
          <h3 className="text-sm font-medium text-foreground-muted">
            {t('results.playerDetail.title')}
          </h3>
          <PlayerDetailCard
            standing={activeStanding}
            tournament={tournament}
          />
        </section>
      )}
    </div>
  )
}
