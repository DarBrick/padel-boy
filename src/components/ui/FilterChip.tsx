interface FilterChipProps {
  label: string
  active: boolean
  onClick: () => void
  className?: string
}

export function FilterChip({ label, active, onClick, className = '' }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        whitespace-nowrap rounded-lg border px-3.5 py-2 text-sm font-medium transition-all
        min-h-[44px] sm:min-h-[46px] md:min-h-[48px]
        ${active 
          ? 'border-padel-500 bg-padel-500/20 text-padel-500 shadow-[0_0_12px_rgba(212,255,0,0.24)]' 
          : 'border-border/70 bg-surface text-foreground-muted hover:border-foreground-muted hover:bg-surface-muted'
        }
        ${className}
      `}
    >
      {label}
    </button>
  )
}
