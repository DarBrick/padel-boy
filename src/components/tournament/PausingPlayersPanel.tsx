import { useTranslation } from 'react-i18next'
import { Coffee } from 'lucide-react'
import type { StoredPlayer } from '../../schemas/tournament'

interface PausingPlayersPanelProps {
  pausingPlayerIndices: number[]
  players: StoredPlayer[]
}

export function PausingPlayersPanel({ pausingPlayerIndices, players }: PausingPlayersPanelProps) {
  const { t } = useTranslation()

  if (pausingPlayerIndices.length === 0) {
    return null
  }

  return (
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
              {players[playerIndex].name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
