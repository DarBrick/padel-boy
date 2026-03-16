import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Line } from 'recharts'
import { CircleSlash2, Scale } from 'lucide-react'
import type { PlayerStanding } from '../../utils/tournamentStats'
import type { StoredTournament } from '../../schemas/tournament'
import { getPartnershipStats, getOpponentStats, getStandingsProgression, getPlayerConsistency } from '../../utils/tournamentInsights'
import { getTournamentStats } from '../../utils/tournamentStats'
import { ChartContainer } from '../ui'

const NEUTRAL_STROKE = 'var(--color-foreground-muted)'
const PAUSED_STROKE = 'var(--color-court-blue)'
const LABEL_COLOR = 'var(--color-foreground-muted)'

interface PlayerDetailCardProps {
  standing: PlayerStanding
  tournament: StoredTournament
}

export function PlayerDetailCard({ standing, tournament }: PlayerDetailCardProps) {
  const { t } = useTranslation()
  const [activeScoreIndex, setActiveScoreIndex] = useState<number | null>(null)
  const [activeRankIndex, setActiveRankIndex] = useState<number | null>(null)
  const [activeBalanceIndex, setActiveBalanceIndex] = useState<number | null>(null)

  const formatSignedValue = (value: number) => (value > 0 ? `+${value}` : `${value}`)
  const getBalanceColorClass = (value: number) =>
    value > 0 ? 'text-green-400' : value < 0 ? 'text-red-400' : 'text-foreground'

  const formattedBalance = formatSignedValue(standing.balance)
  const balanceColor = getBalanceColorClass(standing.balance)
  const matchupStatsColumnsClass = 'grid grid-cols-[4.5rem_4rem_4.5rem] items-center gap-3 text-right'

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
    balance: round.balance,
    outcome: round.outcome,
  }))

  // Calculate chart axis ranges
  const stats = getTournamentStats(tournament)
  const standingsByPlayerIndex = new Map(stats.standings.map(playerStanding => [playerStanding.index, playerStanding.rank]))
  const chartMaxScore = stats.standings.length > 0 ? stats.standings[0].totalPointsWithSitting : 100
  const totalPlayers = tournament.players.length
  const balanceValues = chartData.map(point => point.balance)
  const balanceMin = Math.min(0, ...balanceValues)
  const balanceMax = Math.max(0, ...balanceValues)
  const balancePadding = balanceMin === balanceMax ? 1 : 0
  const balanceChartDomain: [number, number] = [balanceMin - balancePadding, balanceMax + balancePadding]

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      {/* Performance Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-3.5 md:gap-4">
        <StatCard
          label={t('results.playerDetail.totalPointsWithSitting')}
          value={standing.totalPointsWithSitting}
          color="text-padel-500"
        />
        <div className="bg-surface/70 rounded-lg p-3">
          <div className="text-sm text-foreground-muted mb-1">{t('results.standings.record')}</div>
          <div className="text-2xl font-bold whitespace-nowrap">
            <span className="text-green-400">{standing.wins}</span>
            <span className="text-foreground-muted mx-1">/</span>
            <span className="text-yellow-400">{standing.draws}</span>
            <span className="text-foreground-muted mx-1">/</span>
            <span className="text-red-400">{standing.losses}</span>
          </div>
        </div>
        <StatCard
          label={t('results.playerDetail.gamesPlayed')}
          value={`${standing.gamesPlayed}/${standing.gamesPlayed + standing.gamesSitting}`}
        />
        <StatCard
          label={t('results.standings.balance')}
          value={formattedBalance}
          color={balanceColor}
        />
        <StatCard
          label={t('results.playerDetail.pointsFromPausing')}
          value={standing.pointsFromSitting}
        />
      </div>

      {/* Legend */}
      {chartData.length > 0 && (
        <div className="bg-surface/60 rounded-lg p-3">
          <h4 className="text-xs font-medium text-foreground-muted mb-2">{t('results.playerDetail.legend')}</h4>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--color-padel-yellow)' }} />
              <span className="text-xs text-foreground-muted">{t('results.playerDetail.legendWon')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-foreground-muted" />
              <span className="text-xs text-foreground-muted">{t('results.playerDetail.legendLostDrew')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-xs text-foreground-muted">{t('results.playerDetail.legendPaused')}</span>
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
          xAxisLabel={t('results.insights.progression.round')}
          yAxisDomain={[0, chartMaxScore]}
          hideTicks
          tooltipActive={activeScoreIndex !== null}
          tooltipFormatter={(value: number | undefined) => 
            value !== undefined ? [`${value} ${t('results.playerDetail.pointsShort')}`, t('results.standings.totalPoints')] : ['', '']
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
            stroke={NEUTRAL_STROKE}
            strokeWidth={2}
            isAnimationActive={false}
            dot={(props: any) => {
              const { cx, cy, payload, index } = props
              const outcome = payload.outcome
              let fill = NEUTRAL_STROKE
              if (outcome === 'won') fill = 'var(--color-padel-yellow)'
              else if (outcome === 'paused') fill = PAUSED_STROKE
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
            label={(props: any) => <text x={props.x} y={props.y - 12} fill={LABEL_COLOR} fontSize="11" fontWeight="500" textAnchor="middle">{props.value}</text>}
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
          xAxisLabel={t('results.insights.progression.round')}
          yAxisDomain={[1, totalPlayers]}
          yAxisReversed
          hideTicks
          tooltipActive={activeRankIndex !== null}
          tooltipFormatter={(value: number | undefined) => 
            value !== undefined ? [`#${value}`, t('results.standings.rank')] : ['', '']
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
            stroke={NEUTRAL_STROKE}
            strokeWidth={2}
            isAnimationActive={false}
            dot={(props: any) => {
              const { cx, cy, payload, index } = props
              const outcome = payload.outcome
              let fill = NEUTRAL_STROKE
              if (outcome === 'won') fill = 'var(--color-padel-yellow)'
              else if (outcome === 'paused') fill = PAUSED_STROKE
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
            label={(props: any) => <text x={props.x} y={props.y - 12} fill={LABEL_COLOR} fontSize="11" fontWeight="500" textAnchor="middle">#{props.value}</text>}
          />
        </ChartContainer>
      )}

      {/* Balance Progression Chart */}
      {chartData.length > 0 && (
        <ChartContainer
          chartType="line"
          data={chartData}
          height={220}
          title={t('results.playerDetail.balanceProgression')}
          xAxisDataKey="round"
          xAxisLabel={t('results.insights.progression.round')}
          yAxisDomain={balanceChartDomain}
          hideTicks
          tooltipActive={activeBalanceIndex !== null}
          tooltipFormatter={(value: number | undefined) =>
            value !== undefined ? [`${formatSignedValue(value)}`, t('results.standings.balance')] : ['', '']
          }
          chartProps={{
            onClick: (data) => {
              if (data?.activeTooltipIndex !== undefined) {
                setActiveBalanceIndex(
                  activeBalanceIndex === data.activeTooltipIndex ? null : data.activeTooltipIndex,
                )
              }
            },
            style: { cursor: 'pointer', outline: 'none' },
          }}
        >
          <Line
            type="monotone"
            dataKey="balance"
            stroke={NEUTRAL_STROKE}
            strokeWidth={2}
            isAnimationActive={false}
            dot={(props: any) => {
              const { cx, cy, payload, index } = props
              const outcome = payload.outcome
              let fill = NEUTRAL_STROKE
              if (outcome === 'won') fill = 'var(--color-padel-yellow)'
              else if (outcome === 'paused') fill = PAUSED_STROKE
              const isActive = activeBalanceIndex === index
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
            label={(props: any) => (
              <text
                x={props.x}
                y={props.y - 12}
                fill={LABEL_COLOR}
                fontSize="11"
                fontWeight="500"
                textAnchor="middle"
              >
                {formatSignedValue(props.value)}
              </text>
            )}
          />
        </ChartContainer>
      )}

      {/* Partnerships */}
      {playerPartnerships.length > 0 && (
        <div className="bg-surface/60 rounded-lg p-4">
          <h4 className="text-sm font-medium text-foreground-muted mb-3">
            {t('results.playerDetail.partnerships')}
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[11px] text-foreground-muted px-0.5">
              <span>&nbsp;</span>
              <div className={matchupStatsColumnsClass}>
                <span>{t('results.standings.record')}</span>
                <span>{t('results.playerDetail.avgScore')}</span>
                <span>{t('results.standings.balance')}</span>
              </div>
            </div>
            {playerPartnerships.map((partnership) => {
                const partnerIndex = partnership.player1Index === standing.index
                  ? partnership.player2Index
                  : partnership.player1Index
                const partnerName = partnership.player1Index === standing.index
                  ? partnership.player2Name
                  : partnership.player1Name
                const partnerRank = standingsByPlayerIndex.get(partnerIndex)

                return (
                  <div
                    key={`${partnership.player1Index}-${partnership.player2Index}`}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-foreground">
                      {partnerName}
                      {partnerRank !== undefined ? <span className="text-foreground-muted"> (#{partnerRank})</span> : null}
                    </span>
                    <div className={matchupStatsColumnsClass}>
                      <span className="font-medium whitespace-nowrap">
                        <span className="text-green-400">{partnership.wins}</span>
                        <span className="text-foreground-muted mx-1">/</span>
                        <span className="text-yellow-400">{partnership.draws}</span>
                        <span className="text-foreground-muted mx-1">/</span>
                        <span className="text-red-400">{partnership.losses}</span>
                      </span>
                      <span className="text-foreground font-medium flex items-center justify-end gap-1">
                        <CircleSlash2 className="w-3.5 h-3.5" />
                        {partnership.avgPointsPerGame.toFixed(1)}
                      </span>
                      <span className={`${getBalanceColorClass(partnership.balance)} font-medium flex items-center justify-end gap-1`}>
                        <Scale className="w-3.5 h-3.5" />
                        {formatSignedValue(partnership.balance)}
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
        <div className="bg-surface/60 rounded-lg p-4">
          <h4 className="text-sm font-medium text-foreground-muted mb-3">
            {t('results.playerDetail.opponents')}
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[11px] text-foreground-muted px-0.5">
              <span>&nbsp;</span>
              <div className={matchupStatsColumnsClass}>
                <span>{t('results.standings.record')}</span>
                <span>{t('results.playerDetail.avgScore')}</span>
                <span>{t('results.standings.balance')}</span>
              </div>
            </div>
            {opponentStats.map((opponent) => (
              <div
                key={opponent.opponentIndex}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-foreground">
                  {opponent.opponentName}
                  {standingsByPlayerIndex.get(opponent.opponentIndex) !== undefined
                    ? <span className="text-foreground-muted"> (#{standingsByPlayerIndex.get(opponent.opponentIndex)})</span>
                    : null}
                </span>
                <div className={matchupStatsColumnsClass}>
                  <span className="font-medium whitespace-nowrap">
                    <span className="text-green-400">{opponent.wins}</span>
                    <span className="text-foreground-muted mx-1">/</span>
                    <span className="text-yellow-400">{opponent.draws}</span>
                    <span className="text-foreground-muted mx-1">/</span>
                    <span className="text-red-400">{opponent.losses}</span>
                  </span>
                  <span className="text-foreground font-medium flex items-center justify-end gap-1">
                    <CircleSlash2 className="w-3.5 h-3.5" />
                    {opponent.avgPointsPerGame.toFixed(1)}
                  </span>
                  <span className={`${getBalanceColorClass(opponent.balance)} font-medium flex items-center justify-end gap-1`}>
                    <Scale className="w-3.5 h-3.5" />
                    {formatSignedValue(opponent.balance)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Consistency */}
      {consistency && (
        <div className="bg-surface/60 rounded-lg p-4">
          <h4 className="text-sm font-medium text-foreground-muted mb-3">
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
    <div className="bg-surface/70 rounded-lg p-3">
      <div className={`${small ? 'text-xs' : 'text-sm'} text-foreground-muted mb-1`}>{label}</div>
      <div className={`${small ? 'text-lg' : 'text-2xl'} font-bold ${color}`}>{value}</div>
    </div>
  )
}
