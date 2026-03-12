interface RadioOption {
  value: string
  label: string
  description?: string
}

interface RadioCardGroupProps {
  name: string
  options: RadioOption[]
  value: string
  onChange: (value: string) => void
}

export function RadioCardGroup({ name, options, value, onChange }: RadioCardGroupProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-3.5 md:gap-4">
      {options.map((option) => (
        <label
          key={option.value}
          className={`
            flex min-h-[44px] cursor-pointer flex-col items-center rounded-lg border border-border/70 p-3 sm:min-h-[46px] sm:p-3.5 md:min-h-[48px] md:p-4 transition-all
            ${value === option.value 
              ? 'border-padel-500 bg-padel-500/10 shadow-[0_0_10px_rgba(212,255,0,0.22)]' 
              : 'hover:border-foreground-muted hover:bg-surface/70'}
          `}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            className="sr-only"
          />
          <span className="text-xl font-bold mb-1">{option.label}</span>
          {option.description && (
            <span className="text-sm text-foreground-muted text-center">
              {option.description}
            </span>
          )}
        </label>
      ))}
    </div>
  )
}
