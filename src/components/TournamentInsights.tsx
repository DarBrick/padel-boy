import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Bar, Line } from 'recharts'
import type { StoredTournament } from '../schemas/tournament'
import {
  getPartnershipStats,
  getMatchSuperlatives,
  getStandingsProgression,
  getPlayerConsistency,
} from '../utils/tournamentInsights'
import { ContentPanel } from './ContentPanel'
import { ChartContainer } from './ChartContainer'
import { Trophy, TrendingUp, Target } from 'lucide-react'

interface TournamentInsightsProps {
  tournament: StoredTournament
}

export function TournamentInsights({ tournament }: TournamentInsightsProps) {
  const { t } = useTranslation()

  const partnerships = getPartnershipStats(tournament)
  const superlatives = getMatchSuperlatives(tournament)
  const progression = getStandingsProgression(tournament)
  const consistency = getPlayerConsistency(tournament)

  // State for progression chart player selection
  const [selectedPlayers, setSelectedPlayers] = useState<Set<number>>(
    new Set(Array.from({ length: Math.min(5, tournament.players.length) }, (_, i) => i))
  )

  // Top 3 partnerships
  const topPartnerships = partnerships.slice(0, 3)

  // Prepare partnership chart data
  const partnershipChartData = topPartnerships.map((p) => ({
    name: `${p.player1Name.split(' ')[0]} & ${p.player2Name.split(' ')[0]}`,
    fullName: `${p.player1Name} & ${p.player2Name}`,
    winRate: Number((p.winRate * 100).toFixed(1)),
    games: p.gamesPlayed,
  }))

  // Prepare progression chart data
  const progressionChartData = progression.rounds.map((round) => {
    const dataPoint: any = { round }
    
    selectedPlayers.forEach((playerIndex) => {
      const playerProgressions = progression.playerProgressions.get(playerIndex)
      const roundIndex = progression.rounds.indexOf(round)
      if (playerProgressions && playerProgressions[roundIndex]) {
        const playerName = tournament.players[playerIndex].name
        dataPoint[playerName] = Number(playerProgressions[roundIndex].pointsPerGame.toFixed(1))
      }
    })
    
    return dataPoint
  })

  // Player colors for progression chart
  const playerColors = [
    '#D4FF00', // padel yellow
    '#22c55e', // green
    '#3b82f6', // blue
    '#f59e0b', // amber
    '#ec4899', // pink
    '#8b5cf6', // purple
    '#14b8a6', // teal
    '#f97316', // orange
  ]

  const togglePlayerSelection = (playerIndex: number) => {
    const newSelection = new Set(selectedPlayers)
    if (newSelection.has(playerIndex)) {
      newSelection.delete(playerIndex)
    } else {
      newSelection.add(playerIndex)
    }
    setSelectedPlayers(newSelection)
  }

  return (
    <div className="space-y-6 sm:space-y-7 md:space-y-8">
      {/* Partnership Stats */}
      <ContentPanel icon={Trophy} title={t('results.insights.partnerships.title')}>
        {topPartnerships.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            {t('results.insights.partnerships.emptyState')}
          </div>
        ) : (
          <div className="space-y-4">
            <ChartContainer
              chartType="bar"
              data={partnershipChartData}
              height={250}
              xAxisDataKey="name"
              xAxisConfig={{ tick: { fill: '#94a3b8', fontSize: 12 } }}
              yAxisLabel={t('results.insights.partnerships.winRate') + ' (%)'}
            >
              <Bar dataKey="winRate" fill="var(--color-padel-yellow)" radius={[8, 8, 0, 0]} />
            </ChartContainer>

            <div className="space-y-2">
              {topPartnerships.map((partnership, idx) => (
                <div
                  key={`${partnership.player1Index}-${partnership.player2Index}`}
                  className="flex justify-between items-center bg-slate-800/50 rounded-lg p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-bold text-slate-600">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">
                        {partnership.player1Name} & {partnership.player2Name}
                      </div>
                      <div className="text-xs text-slate-400">
                        {partnership.gamesPlayed} {partnership.gamesPlayed === 1 ? 'game' : 'games'}
                      </div>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-[var(--color-padel-yellow)]">
                    {(partnership.winRate * 100).toFixed(0)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </ContentPanel>

      {/* Match Superlatives */}
      <ContentPanel icon={Target} title={t('results.insights.superlatives.title')}>
        {!superlatives.closestMatch && !superlatives.biggestBlowout && !superlatives.highestScoring ? (
          <div className="text-center py-8 text-slate-400">
            {t('results.insights.superlatives.emptyState')}
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            {superlatives.closestMatch && (
              <SuperlativeCard
                title={t('results.insights.superlatives.closestMatch')}
                match={superlatives.closestMatch}
                color="text-green-400"
              />
            )}
            {superlatives.biggestBlowout && (
              <SuperlativeCard
                title={t('results.insights.superlatives.biggestBlowout')}
                match={superlatives.biggestBlowout}
                color="text-red-400"
              />
            )}
            {superlatives.highestScoring && (
              <SuperlativeCard
                title={t('results.insights.superlatives.highestScoring')}
                match={superlatives.highestScoring}
                color="text-[var(--color-padel-yellow)]"
              />
            )}
          </div>
        )}
      </ContentPanel>

      {/* Standings Progression */}
      <ContentPanel icon={TrendingUp} title={t('results.insights.progression.title')}>
        {progression.rounds.length < 2 ? (
          <div className="text-center py-8 text-slate-400">
            {t('results.insights.progression.emptyState')}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Player selection */}
            <div>
              <div className="text-sm text-slate-400 mb-2">
                {t('results.insights.progression.selectPlayers')}
              </div>
              <div className="flex flex-wrap gap-2">
                {tournament.players.map((player, idx) => (
                  <button
                    key={idx}
                    onClick={() => togglePlayerSelection(idx)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all
                      ${
                        selectedPlayers.has(idx)
                          ? 'bg-[var(--color-padel-yellow)] text-slate-900 font-medium'
                          : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700'
                      }
                    `}
                  >
                    {player.name}
                  </button>
                ))}
              </div>
            </div>

            {selectedPlayers.size > 0 && (
              <ChartContainer
                chartType="line"
                data={progressionChartData}
                height={300}
                xAxisDataKey="round"
                xAxisLabel={t('results.insights.progression.round')}
                yAxisLabel="Points/Game"
                showLegend
              >
                {Array.from(selectedPlayers).map((playerIndex, idx) => (
                  <Line
                    key={playerIndex}
                    type="monotone"
                    dataKey={tournament.players[playerIndex].name}
                    stroke={playerColors[idx % playerColors.length]}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                ))}
              </ChartContainer>
            )}
          </div>
        )}
      </ContentPanel>

      {/* Player Consistency */}
      <ContentPanel title={t('results.insights.consistency.title')}>
        {consistency.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            {t('results.insights.consistency.emptyState')}
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {/* Most Consistent */}
            <div className="bg-slate-800/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-green-400 mb-3">
                {t('results.insights.consistency.mostConsistent')}
              </h4>
              {consistency.slice(0, 3).map((player) => (
                <div
                  key={player.playerIndex}
                  className="flex justify-between items-center py-2 border-b border-slate-700 last:border-0"
                >
                  <div>
                    <div className="text-sm font-medium text-white">{player.playerName}</div>
                    <div className="text-xs text-slate-400">
                      {t('results.insights.consistency.avgScore')}: {player.averageScore.toFixed(1)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-[var(--color-padel-yellow)] font-bold">
                      σ: {player.scoreStdDev.toFixed(1)}
                    </div>
                    <div className="text-xs text-slate-400">
                      {t('results.insights.consistency.range')}: {player.scoreRange}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Least Consistent */}
            <div className="bg-slate-800/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-amber-400 mb-3">
                {t('results.insights.consistency.leastConsistent')}
              </h4>
              {consistency.slice(-3).reverse().map((player) => (
                <div
                  key={player.playerIndex}
                  className="flex justify-between items-center py-2 border-b border-slate-700 last:border-0"
                >
                  <div>
                    <div className="text-sm font-medium text-white">{player.playerName}</div>
                    <div className="text-xs text-slate-400">
                      {t('results.insights.consistency.avgScore')}: {player.averageScore.toFixed(1)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-amber-400 font-bold">
                      σ: {player.scoreStdDev.toFixed(1)}
                    </div>
                    <div className="text-xs text-slate-400">
                      {t('results.insights.consistency.range')}: {player.scoreRange}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </ContentPanel>
    </div>
  )
}

interface SuperlativeCardProps {
  title: string
  match: {
    roundNumber: number
    team1Names: [string, string]
    team2Names: [string, string]
    score1: number
    score2: number
  }
  color: string
}

function SuperlativeCard({ title, match, color }: SuperlativeCardProps) {
  const { t } = useTranslation()

  return (
    <div className="bg-slate-800/50 rounded-lg p-4">
      <h4 className={`text-sm font-medium ${color} mb-3`}>{title}</h4>
      <div className="space-y-2">
        <div className="text-xs text-slate-400">
          {t('results.insights.superlatives.round', { number: match.roundNumber })}
        </div>
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-sm text-white">{match.team1Names.join(' & ')}</span>
            <span className="text-lg font-bold text-white">{match.score1}</span>
          </div>
          <div className="text-center text-xs text-slate-500">VS</div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-white">{match.team2Names.join(' & ')}</span>
            <span className="text-lg font-bold text-white">{match.score2}</span>
          </div>
        </div>
        <div className={`text-center text-lg font-bold ${color} mt-2`}>
          {match.score1} - {match.score2}
        </div>
      </div>
    </div>
  )
}
