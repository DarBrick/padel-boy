import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { ContentPanel } from '../ui'
import type { StoredMatch } from '../../schemas/tournament'

interface MatchCardProps {
  match: StoredMatch
  courtNumber: number
  courtName?: string
  playerNames: string[]
  pointsPerGame: number
  onUpdateMatch: (updatedMatch: StoredMatch) => void
  readonly?: boolean
}

export function MatchCard({
  match,
  courtNumber,
  courtName,
  playerNames,
  pointsPerGame,
  onUpdateMatch,
  readonly = false,
}: MatchCardProps) {
  const { t } = useTranslation()
  const [showScorePicker, setShowScorePicker] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<0 | 1 | null>(null)

  // Get player names for each team
  const team1Players = match.team1.map((idx) => playerNames[idx])
  const team2Players = match.team2.map((idx) => playerNames[idx])

  // Calculate scores if match is finished
  const getTeamScores = () => {
    if (!match.isFinished || match.winner === undefined || match.scoreDelta === undefined) {
      return { team1Score: null, team2Score: null }
    }

    const winningScore = Math.floor((pointsPerGame + match.scoreDelta) / 2)
    const losingScore = Math.floor((pointsPerGame - match.scoreDelta) / 2)

    return {
      team1Score: match.winner === 0 ? winningScore : losingScore,
      team2Score: match.winner === 1 ? winningScore : losingScore,
    }
  }

  const { team1Score, team2Score } = getTeamScores()
  const isDraw = match.scoreDelta === 0 && match.isFinished

  // Handle score selection
  const handleScoreSelect = (teamIndex: 0 | 1, score: number) => {
    const teamScore = score
    const opponentScore = pointsPerGame - score

    const updatedMatch: StoredMatch = {
      ...match,
      isFinished: true,
      winner: teamScore > opponentScore ? teamIndex : teamIndex === 0 ? 1 : 0,
      scoreDelta: Math.abs(teamScore - opponentScore),
    }

    onUpdateMatch(updatedMatch)
    setSelectedTeam(null)
  }

  // Generate score options (0 to pointsPerGame)
  const scoreOptions = Array.from({ length: pointsPerGame + 1 }, (_, i) => i)

  // Open score picker
  const handleOpenScorePicker = (teamIndex: 0 | 1) => {
    setSelectedTeam(teamIndex)
    setShowScorePicker(true)
  }

  // Close score picker
  const handleCloseScorePicker = () => {
    setShowScorePicker(false)
    setSelectedTeam(null)
  }

  // Clear match results
  const handleClearResults = () => {
    const clearedMatch: StoredMatch = {
      ...match,
      isFinished: false,
      winner: undefined,
      scoreDelta: undefined,
    }
    onUpdateMatch(clearedMatch)
    handleCloseScorePicker()
  }

  return (
    <>
      <ContentPanel className="relative">
        {/* Court Label */}
        <div className="text-center mb-3">
          <h3 className="text-base font-semibold text-slate-400">
            {courtName || t('tournament.courtLabel', { number: courtNumber })}
          </h3>
        </div>

        {/* Match Container */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-start">
          {/* Team 1 */}
          <button
            type="button"
            onClick={() => handleOpenScorePicker(0)}
            disabled={readonly}
            className="flex items-center gap-1 text-left py-2 cursor-pointer hover:text-[var(--color-padel-yellow)] active:text-[var(--color-padel-yellow)] transition-colors group disabled:cursor-not-allowed disabled:hover:text-slate-300"
          >
            <div className="space-y-1 flex-1">
              {team1Players.map((name, idx) => (
                <div key={idx} className="text-base font-medium truncate">
                  {name}
                </div>
              ))}
            </div>
            <ChevronLeft className="w-4 h-4 text-slate-500 flex-shrink-0" />
          </button>

          {/* VS Divider */}
          <div className="flex items-center justify-center px-1 pt-1">
            <div className="text-sm text-slate-500 font-semibold">
              {t('tournament.match.vs')}
            </div>
          </div>

          {/* Team 2 */}
          <button
            type="button"
            onClick={() => handleOpenScorePicker(1)}
            disabled={readonly}
            className="flex items-center gap-1 justify-end text-right py-2 cursor-pointer hover:text-[var(--color-padel-yellow)] active:text-[var(--color-padel-yellow)] transition-colors group disabled:cursor-not-allowed disabled:hover:text-slate-300"
          >
            <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <div className="space-y-1 flex-1">
              {team2Players.map((name, idx) => (
                <div key={idx} className="text-base font-medium truncate">
                  {name}
                </div>
              ))}
            </div>
          </button>
        </div>

        {/* Score Display */}
        {match.isFinished && team1Score !== null && team2Score !== null ? (
          <div className="mt-4 pt-4 border-t border-slate-700">
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => handleOpenScorePicker(0)}
                disabled={readonly}
                className="flex items-center gap-1 text-4xl font-bold text-[var(--color-padel-yellow)] cursor-pointer hover:opacity-80 active:scale-95 transition-all px-4 py-2 rounded-lg hover:bg-slate-700/50 disabled:cursor-not-allowed disabled:hover:opacity-100 disabled:hover:bg-transparent"
              >
                <span>{team1Score}</span>
                <ChevronLeft className="w-5 h-5 text-slate-500" />
              </button>
              <div className="text-2xl font-bold text-slate-600">-</div>
              <button
                type="button"
                onClick={() => handleOpenScorePicker(1)}
                disabled={readonly}
                className="flex items-center gap-1 text-4xl font-bold text-[var(--color-padel-yellow)] cursor-pointer hover:opacity-80 active:scale-95 transition-all px-4 py-2 rounded-lg hover:bg-slate-700/50 disabled:cursor-not-allowed disabled:hover:opacity-100 disabled:hover:bg-transparent"
              >
                <ChevronRight className="w-5 h-5 text-slate-500" />
                <span>{team2Score}</span>
              </button>
            </div>
            {isDraw && (
              <div className="text-center mt-2">
                <span className="text-sm text-amber-400 font-medium">
                  {t('tournament.match.draw')}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-4 pt-4 border-t border-slate-700">
            <div className="text-center text-slate-500 text-sm">
              {t('tournament.match.incomplete')}
            </div>
          </div>
        )}
      </ContentPanel>

      {/* Score Picker Modal */}
      {showScorePicker && selectedTeam !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={handleCloseScorePicker}
          />
          
          {/* Modal Content */}
          <div className="relative bg-slate-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-center mb-2">
                {t('tournament.match.selectScore')}
              </h3>
              <p className="text-2xl font-bold text-[var(--color-padel-yellow)] text-center">
                {selectedTeam === 0 ? team1Players.join(' & ') : team2Players.join(' & ')}
              </p>
            </div>
            
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
              {scoreOptions.map((score) => {
                const opponentScore = pointsPerGame - score
                return (
                  <button
                    key={score}
                    type="button"
                    onClick={() => {
                      handleScoreSelect(selectedTeam, score)
                      handleCloseScorePicker()
                    }}
                    className="flex flex-col items-center justify-center p-4 bg-slate-700 hover:bg-[var(--color-padel-yellow)] hover:text-slate-900 rounded-lg transition-all min-h-[80px] group"
                  >
                    <div className="text-2xl font-bold mb-1">{score}</div>
                    <div className="text-xs text-slate-400 group-hover:text-slate-700">
                      vs {opponentScore}
                    </div>
                  </button>
                )
              })}
            </div>
            
            <div className="mt-6 flex gap-3">
              {match.isFinished && (
                <button
                  type="button"
                  onClick={handleClearResults}
                  className="flex-1 px-6 py-3 bg-red-700/80 hover:bg-red-700 rounded-lg transition-colors text-base font-medium"
                >
                  {t('tournament.match.clearResults')}
                </button>
              )}
              <button
                type="button"
                onClick={handleCloseScorePicker}
                className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-base font-medium"
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
