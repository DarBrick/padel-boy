import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'

interface CourtChipProps {
  name: string
  index: number
  onRename: (newName: string) => void
  onDelete: () => void
  canRemove?: boolean
}

export function CourtChip({ name, index, onRename, onDelete, canRemove = true }: CourtChipProps) {
  const { t } = useTranslation()
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(name)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleSubmit = () => {
    const trimmed = editValue.trim()
    onRename(trimmed)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditValue(name)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleCancel()
    }
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 sm:px-3.5 sm:py-2 md:px-4 md:py-2.5 bg-slate-700 border border-[var(--color-padel-yellow)] rounded-lg">
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
          placeholder={t('create.courts.placeholder', { number: index + 1 })}
          maxLength={40}
          className="flex-1 bg-transparent border-none outline-none text-base min-h-[24px] placeholder:text-slate-500"
        />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 sm:px-3.5 sm:py-2 md:px-4 md:py-2.5 bg-slate-700 border border-slate-600 rounded-lg group hover:border-[var(--color-padel-yellow)]/50 transition-colors">
      <button
        type="button"
        onClick={() => {
          setEditValue(name)
          setIsEditing(true)
        }}
        className="text-base hover:text-[var(--color-padel-yellow)] transition-colors min-h-[24px] flex-1 text-left truncate"
      >
        <span className="text-slate-400 mr-1.5">#{index + 1}</span>
        {name ? (
          <span className="truncate">{name}</span>
        ) : (
          <span className="text-slate-400 truncate">{t('create.courts.placeholder', { number: index + 1 })}</span>
        )}
      </button>
      {canRemove && (
        <button
          type="button"
          onClick={onDelete}
          className="p-1 text-slate-400 hover:text-red-400 transition-colors opacity-70 group-hover:opacity-100 flex-shrink-0"
          aria-label={`Remove court ${index + 1}`}
        >
          <X className="w-6 h-6" />
        </button>
      )}
    </div>
  )
}
