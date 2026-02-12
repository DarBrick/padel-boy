import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { PlayerStanding } from '../utils/tournamentStats'

type SortField = 'rank' | 'pointsPerGame' | 'winRate' | 'totalPoints' | 'record'

interface StandingsTableProps {
  standings: PlayerStanding[]
}

export function StandingsTable({ standings }: StandingsTableProps) {
  const { t } = useTranslation()
  const [sortField, setSortField] = useState<SortField>('rank')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  if (standings.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        {t('results.standings.emptyState')}
      </div>
    )
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection(field === 'rank' ? 'asc' : 'desc')
    }
  }

  const sortedStandings = [...standings].sort((a, b) => {
    let compareValue = 0
    
    switch (sortField) {
      case 'rank':
        compareValue = standings.indexOf(a) - standings.indexOf(b)
        break
      case 'pointsPerGame':
        compareValue = b.pointsPerGame - a.pointsPerGame
        break
      case 'winRate':
        compareValue = b.winRate - a.winRate
        break
      case 'totalPoints':
        compareValue = b.totalPointsWithSitting - a.totalPointsWithSitting
        break
      case 'record':
        // Sort by: 1) wins (more is better), 2) losses (less is better), 3) draws (more is better)
        compareValue = b.wins - a.wins
        if (compareValue === 0) {
          compareValue = a.losses - b.losses
        }
        if (compareValue === 0) {
          compareValue = b.draws - a.draws
        }
        break
    }

    return sortDirection === 'asc' ? compareValue : -compareValue
  })

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4 inline ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 inline ml-1" />
    )
  }

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return ''
  }

  return (
    <div className="overflow-x-auto -mx-4 sm:-mx-5 md:-mx-6">
      <div className="inline-block min-w-full align-middle">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-slate-800/50">
            <tr>
              <th
                onClick={() => handleSort('rank')}
                className="px-3 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider cursor-pointer hover:text-[var(--color-padel-yellow)] whitespace-nowrap"
              >
                {t('results.standings.rank')}
                <SortIcon field="rank" />
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider whitespace-nowrap">
                {t('results.standings.player')}
              </th>
              <th
                onClick={() => handleSort('record')}
                className="px-3 py-3 text-center text-xs font-medium text-slate-300 uppercase tracking-wider cursor-pointer hover:text-[var(--color-padel-yellow)] whitespace-nowrap"
              >
                {t('results.standings.record')}
                <SortIcon field="record" />
              </th>
              <th
                onClick={() => handleSort('winRate')}
                className="px-3 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider cursor-pointer hover:text-[var(--color-padel-yellow)] whitespace-nowrap"
              >
                {t('results.standings.winRate')}
                <SortIcon field="winRate" />
              </th>
              <th
                onClick={() => handleSort('totalPoints')}
                className="px-3 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider cursor-pointer hover:text-[var(--color-padel-yellow)] whitespace-nowrap"
              >
                {t('results.standings.totalPoints')}
                <SortIcon field="totalPoints" />
              </th>
              <th
                onClick={() => handleSort('pointsPerGame')}
                className="px-3 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider cursor-pointer hover:text-[var(--color-padel-yellow)] whitespace-nowrap"
              >
                {t('results.standings.pointsPerGame')}
                <SortIcon field="pointsPerGame" />
              </th>
            </tr>
          </thead>
          <tbody className="bg-slate-800/30 divide-y divide-slate-700">
            {sortedStandings.map((standing) => (
              <tr key={standing.index}>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-white">
                      <div className="flex items-center gap-2">
                        <span>{standing.rank}</span>
                        {getMedalEmoji(standing.rank) && (
                          <span className="text-lg">{getMedalEmoji(standing.rank)}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-4 text-sm text-white font-medium">
                      {standing.name}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-center text-slate-300">
                      <span className="text-green-400">{standing.wins}</span>
                      <span className="text-slate-500 mx-1">/</span>
                      <span className="text-yellow-400">{standing.draws}</span>
                      <span className="text-slate-500 mx-1">/</span>
                      <span className="text-red-400">{standing.losses}</span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-right text-slate-300">
                      {(standing.winRate * 100).toFixed(0)}%
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-right text-slate-300">
                      {standing.totalPointsWithSitting}
                    </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-right text-[var(--color-padel-yellow)] font-bold">
                  {standing.pointsPerGame.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
