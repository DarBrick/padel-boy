import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Users, Plus } from 'lucide-react'
import { PlayerChip } from './PlayerChip'
import { PlayerInput } from './PlayerInput'
import { CollapsiblePanel } from './CollapsiblePanel'

interface PlayersPanelProps {
  players: string[]
  onPlayersChange: (players: string[]) => void
  suggestions?: string[]
}

export function PlayersPanel({ players, onPlayersChange, suggestions = [] }: PlayersPanelProps) {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(true)
  const [newPlayerName, setNewPlayerName] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const handleRename = (index: number, newName: string) => {
    const updated = [...players]
    updated[index] = newName
    onPlayersChange(updated)
  }

  const handleDelete = (index: number) => {
    const updated = players.filter((_, i) => i !== index)
    onPlayersChange(updated)
  }

  const handleAddPlayer = () => {
    const trimmed = newPlayerName.trim()
    if (trimmed) {
      onPlayersChange([...players, trimmed])
      setNewPlayerName('')
    }
    setIsAdding(false)
  }

  const handleAddCancel = () => {
    setNewPlayerName('')
    setIsAdding(false)
  }

  return (
    <CollapsiblePanel
      icon={<Users className="w-5 h-5 inline-block mr-2" />}
      label={t('create.players.label')}
      value={players.length}
      isExpanded={isExpanded}
      onToggle={() => setIsExpanded(!isExpanded)}
    >
      <div className="space-y-4">
        {/* Player chips */}
        <div className="flex flex-wrap gap-2">
          {players.map((player, index) => (
            <PlayerChip
              key={`${player}-${index}`}
              name={player}
              onRename={(newName) => handleRename(index, newName)}
              onDelete={() => handleDelete(index)}
              suggestions={suggestions}
            />
          ))}
        </div>

        {/* Add player input */}
        {isAdding ? (
          <div className="flex gap-2 items-center">
            <div className="flex-1 max-w-xs">
              <PlayerInput
                value={newPlayerName}
                onChange={setNewPlayerName}
                onSubmit={handleAddPlayer}
                onCancel={handleAddCancel}
                suggestions={suggestions}
                placeholder={t('create.players.namePlaceholder')}
                autoFocus
              />
            </div>
            <button
              type="button"
              onClick={handleAddPlayer}
              className="p-3 bg-[var(--color-padel-yellow)] text-slate-900 rounded-lg hover:bg-[#C5F000] transition-colors min-h-[48px]"
              aria-label={t('create.players.add')}
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-5 py-3 text-base text-slate-300 hover:text-[var(--color-padel-yellow)] border border-dashed border-slate-600 hover:border-[var(--color-padel-yellow)]/50 rounded-lg transition-colors min-h-[48px]"
          >
            <Plus className="w-5 h-5" />
            {t('create.players.add')}
          </button>
        )}

        <p className="text-slate-400 text-sm">
          {t('create.players.hint')}
        </p>
      </div>
    </CollapsiblePanel>
  )
}
