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
            flex flex-col items-center p-3 sm:p-3.5 md:p-4 rounded-lg border-2 cursor-pointer transition-all
            ${value === option.value 
              ? 'border-padel-500 bg-padel-500/10' 
              : 'border-border hover:border-foreground-muted'}
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
