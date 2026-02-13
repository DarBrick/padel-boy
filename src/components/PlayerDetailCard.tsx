import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Line } from 'recharts'
import { Link, Swords, CircleSlash2 } from 'lucide-react'
import type { PlayerStanding } from '../utils/tournamentStats'
import type { StoredTournament } from '../schemas/tournament'
import { getPartnershipStats, getOpponentStats, getStandingsProgression, getPlayerConsistency } from '../utils/tournamentInsights'
import { getTournamentStats } from '../utils/tournamentStats'
import { ChartContainer } from './ChartContainer'

interface PlayerDetailCardProps {
  standing: PlayerStanding
  tournament: StoredTournament
}

export function PlayerDetailCard({ standing, tournament }: PlayerDetailCardProps) {
  const { t } = useTranslation()
  const [activeScoreIndex, setActiveScoreIndex] = useState<number | null>(null)
  const [activeRankIndex, setActiveRankIndex] = useState<number | null>(null)

  // Get partnerships for this player
  const allPartnerships = getPartnershipStats(tournament)
  const playerPartnerships = allPartnerships.filter(
    p => p.player1Index === standing.index || p.player2Index === standing.index
  )

  // Get opponent stats for this player
  const opponentStats = getOpponentStats(tournament, standing.index)

  // Get consistency metrics for this player
  const allConsistencies = getPlayerConsistency(tournament)
  const consistency = allConsistencies.find(c => c.playerIndex === standing.index)

  // Get score progression data
  const progression = getStandingsProgression(tournament)
  const playerProgression = progression.playerProgressions.get(standing.index) || []
  
  const chartData = playerProgression.map((round, idx) => ({
    round: progression.rounds[idx],
    points: round.totalPointsWithSitting,
    rank: round.rank,
    outcome: round.outcome,
  }))

  // Calculate chart axis ranges
  const stats = getTournamentStats(tournament)
  const chartMaxScore = stats.standings.length > 0 ? stats.standings[0].totalPointsWithSitting : 100
  const totalPlayers = tournament.players.length

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      {/* Performance Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-3.5 md:gap-4">
        <StatCard
          label={t('results.playerDetail.totalPointsWithSitting')}
          value={standing.totalPointsWithSitting}
          color="text-[var(--color-padel-yellow)]"
        />
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="text-sm text-slate-400 mb-1">{t('results.standings.record')}</div>
          <div className="text-2xl font-bold whitespace-nowrap">
            <span className="text-green-400">{standing.wins}</span>
            <span className="text-slate-500 mx-1">/</span>
            <span className="text-yellow-400">{standing.draws}</span>
            <span className="text-slate-500 mx-1">/</span>
            <span className="text-red-400">{standing.losses}</span>
          </div>
        </div>
        <StatCard
          label={t('results.playerDetail.gamesPlayed')}
          value={`${standing.gamesPlayed}/${standing.gamesPlayed + standing.gamesSitting}`}
        />
        <StatCard
          label={t('results.playerDetail.pointsFromPausing')}
          value={standing.pointsFromSitting}
        />
      </div>

      {/* Legend */}
      {chartData.length > 0 && (
        <div className="bg-slate-800/50 rounded-lg p-3">
          <h4 className="text-xs font-medium text-slate-400 mb-2">{t('results.playerDetail.legend')}</h4>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--color-padel-yellow)' }} />
              <span className="text-xs text-slate-300">{t('results.playerDetail.legendWon')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-500" />
              <span className="text-xs text-slate-300">{t('results.playerDetail.legendLostDrew')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-xs text-slate-300">{t('results.playerDetail.legendPaused')}</span>
            </div>
          </div>
        </div>
      )}

      {/* Score Progression Chart */}
      {chartData.length > 0 && (
        <ChartContainer
          chartType="line"
          data={chartData}
          height={220}
          title={t('results.playerDetail.scoreProgression')}
          xAxisDataKey="round"
          xAxisLabel="Round"
          yAxisDomain={[0, chartMaxScore]}
          hideTicks
          tooltipActive={activeScoreIndex !== null}
          tooltipFormatter={(value: number | undefined) => 
            value !== undefined ? [`${value} pts`, 'Total Points'] : ['', '']
          }
          chartProps={{
            onClick: (data) => {
              if (data?.activeTooltipIndex !== undefined) {
                setActiveScoreIndex(
                  activeScoreIndex === data.activeTooltipIndex ? null : data.activeTooltipIndex
                )
              }
            },
            style: { cursor: 'pointer', outline: 'none' },
          }}
        >
          <Line
            type="monotone"
            dataKey="points"
            stroke="#64748b"
            strokeWidth={2}
            isAnimationActive={false}
            dot={(props: any) => {
              const { cx, cy, payload, index } = props
              const outcome = payload.outcome
              let fill = '#64748b'
              if (outcome === 'won') fill = 'var(--color-padel-yellow)'
              else if (outcome === 'paused') fill = '#3b82f6'
              const isActive = activeScoreIndex === index
              return (
                <circle 
                  cx={cx} 
                  cy={cy} 
                  r={isActive ? 9 : 7} 
                  fill={fill} 
                  stroke={fill} 
                  strokeWidth={isActive ? 2 : 1}
                />
              )
            }}
            activeDot={false}
            label={(props: any) => <text x={props.x} y={props.y - 12} fill="#cbd5e1" fontSize="11" fontWeight="500" textAnchor="middle">{props.value}</text>}
          />
        </ChartContainer>
      )}

      {/* Rank Progression Chart */}
      {chartData.length > 0 && (
        <ChartContainer
          chartType="line"
          data={chartData}
          height={220}
          title={t('results.playerDetail.rankProgression')}
          xAxisDataKey="round"
          xAxisLabel="Round"
          yAxisDomain={[1, totalPlayers]}
          yAxisReversed
          hideTicks
          tooltipActive={activeRankIndex !== null}
          tooltipFormatter={(value: number | undefined) => 
            value !== undefined ? [`#${value}`, 'Rank'] : ['', '']
          }
          chartProps={{
            onClick: (data) => {
              if (data?.activeTooltipIndex !== undefined) {
                setActiveRankIndex(
                  activeRankIndex === data.activeTooltipIndex ? null : data.activeTooltipIndex
                )
              }
            },
            style: { cursor: 'pointer', outline: 'none' },
          }}
        >
          <Line
            type="monotone"
            dataKey="rank"
            stroke="#64748b"
            strokeWidth={2}
            isAnimationActive={false}
            dot={(props: any) => {
              const { cx, cy, payload, index } = props
              const outcome = payload.outcome
              let fill = '#64748b'
              if (outcome === 'won') fill = 'var(--color-padel-yellow)'
              else if (outcome === 'paused') fill = '#3b82f6'
              const isActive = activeRankIndex === index
              return (
                <circle 
                  cx={cx} 
                  cy={cy} 
                  r={isActive ? 9 : 7} 
                  fill={fill} 
                  stroke={fill} 
                  strokeWidth={isActive ? 2 : 1}
                />
              )
            }}
            activeDot={false}
            label={(props: any) => <text x={props.x} y={props.y - 12} fill="#cbd5e1" fontSize="11" fontWeight="500" textAnchor="middle">#{props.value}</text>}
          />
        </ChartContainer>
      )}

      {/* Partnerships */}
      {playerPartnerships.length > 0 && (
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-slate-300 mb-3">
            {t('results.playerDetail.partnerships')}
          </h4>
          <div className="space-y-2">
            {playerPartnerships
              .sort((a, b) => b.pointsGained - a.pointsGained)
              .map((partnership) => {
                const partnerName = partnership.player1Index === standing.index
                  ? partnership.player2Name
                  : partnership.player1Name

                return (
                  <div
                    key={`${partnership.player1Index}-${partnership.player2Index}`}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-white">{partnerName}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Link className="w-3.5 h-3.5" />
                        {partnership.gamesPlayed}
                      </span>
                      <span className="text-slate-400">
                        {partnership.pointsGained}p
                      </span>
                      <span className="text-[var(--color-padel-yellow)] font-medium flex items-center gap-1">
                        <CircleSlash2 className="w-3.5 h-3.5" />
                        {partnership.avgPointsPerGame.toFixed(1)}
                      </span>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {/* Opponents */}
      {opponentStats.length > 0 && (
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-slate-300 mb-3">
            {t('results.playerDetail.opponents')}
          </h4>
          <div className="space-y-2">
            {opponentStats.map((opponent) => (
              <div
                key={opponent.opponentIndex}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-white">{opponent.opponentName}</span>
                <div className="flex items-center gap-4">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Swords className="w-3.5 h-3.5" />
                    {opponent.gamesPlayed}
                  </span>
                  <span className="text-slate-400">
                    {opponent.pointsScored}p
                  </span>
                  <span className="text-[var(--color-padel-yellow)] font-medium flex items-center gap-1">
                    <CircleSlash2 className="w-3.5 h-3.5" />
                    {opponent.avgPointsPerGame.toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Consistency */}
      {consistency && (
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-slate-300 mb-3">
            {t('results.playerDetail.consistency')}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard
              label={t('results.playerDetail.avgScore')}
              value={consistency.averageScore.toFixed(1)}
              small
            />
            <StatCard
              label={t('results.playerDetail.scoreRange')}
              value={`${consistency.minScore}-${consistency.maxScore}`}
              small
            />
            <StatCard
              label={t('results.playerDetail.stdDev')}
              value={consistency.scoreStdDev.toFixed(1)}
              small
            />
            <StatCard
              label="Variance"
              value={consistency.scoreVariance.toFixed(1)}
              small
            />
          </div>
        </div>
      )}
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string | number
  color?: string
  small?: boolean
}

function StatCard({ label, value, color = 'text-white', small = false }: StatCardProps) {
  return (
    <div className="bg-slate-700/50 rounded-lg p-3">
      <div className={`${small ? 'text-xs' : 'text-sm'} text-slate-400 mb-1`}>{label}</div>
      <div className={`${small ? 'text-lg' : 'text-2xl'} font-bold ${color}`}>{value}</div>
    </div>
  )
}
