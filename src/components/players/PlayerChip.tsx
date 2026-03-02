import { useState } from 'react'
import { X } from 'lucide-react'
import { PlayerInput } from './PlayerInput'

interface PlayerChipProps {
  name: string
  index: number
  onRename: (newName: string) => void
  onDelete: () => void
  suggestions?: string[]
}

export function PlayerChip({ name, index, onRename, onDelete, suggestions = [] }: PlayerChipProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(name)

  const handleSubmit = () => {
    const trimmed = editValue.trim()
    if (trimmed && trimmed !== name) {
      onRename(trimmed)
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditValue(name)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="inline-block w-40">
        <PlayerInput
          value={editValue}
          onChange={setEditValue}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          suggestions={suggestions}
          autoFocus
        />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 sm:px-3.5 sm:py-2 md:px-4 md:py-2.5 bg-surface border border-border rounded-lg group hover:border-padel-500/50 transition-colors">
      <button
        type="button"
        onClick={() => {
          setEditValue(name)
          setIsEditing(true)
        }}
        className="text-base hover:text-padel-500 transition-colors min-h-[24px] flex-1 text-left"
      >
        <span className="text-foreground-muted mr-1.5">#{index + 1}</span>
        {name}
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="p-1 text-foreground-muted hover:text-danger transition-colors opacity-70 group-hover:opacity-100 flex-shrink-0"
        aria-label={`Remove ${name}`}
      >
        <X className="w-6 h-6" />
      </button>
    </div>
  )
}
