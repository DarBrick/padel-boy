import { useState, useRef, useEffect } from 'react'

interface PlayerInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  onCancel?: () => void
  onBlur?: () => void
  suggestions?: string[]
  placeholder?: string
  autoFocus?: boolean
  hasError?: boolean
}

export function PlayerInput({
  value,
  onChange,
  onSubmit,
  onCancel,
  onBlur,
  suggestions = [],
  placeholder = '',
  autoFocus = false,
  hasError = false,
}: PlayerInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredSuggestions = suggestions.filter(
    (s) => s.toLowerCase().includes(value.toLowerCase()) && s.toLowerCase() !== value.toLowerCase()
  )

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [autoFocus])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIndex >= 0 && filteredSuggestions[selectedIndex]) {
        onChange(filteredSuggestions[selectedIndex])
        setShowSuggestions(false)
        setSelectedIndex(-1)
      }
      onSubmit()
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      onCancel?.()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion)
    setShowSuggestions(false)
    setSelectedIndex(-1)
    onSubmit()
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setShowSuggestions(true)
          setSelectedIndex(-1)
        }}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => {
          setTimeout(() => {
            setShowSuggestions(false)
            const trimmed = value.trim()
            if (hasError) {
              onCancel?.()
            } else if (onBlur) {
              if (trimmed) {
                onChange(trimmed)
                onBlur()
              } else {
                onCancel?.()
              }
            } else if (trimmed) {
              onSubmit()
            } else {
              onCancel?.()
            }
          }, 150)
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        maxLength={16}
        className={`w-full px-4 py-2 sm:py-2.5 md:py-3 bg-slate-700 rounded-lg text-base focus:outline-none transition-colors ${
          hasError 
            ? 'border-2 border-red-500 focus:border-red-500' 
            : 'border border-slate-600 focus:border-[var(--color-padel-yellow)]'
        }`}
      />
      
      {/* Suggestions dropdown (future use) */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-slate-700 border border-slate-600 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className={`
                w-full px-4 py-2 sm:py-2.5 md:py-3 text-left text-base hover:bg-slate-600 transition-colors
                ${index === selectedIndex ? 'bg-slate-600' : ''}
                ${index === 0 ? 'rounded-t-lg' : ''}
                ${index === filteredSuggestions.length - 1 ? 'rounded-b-lg' : ''}
              `}
            >
              <span className="text-slate-400 mr-2">🕐</span>
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
