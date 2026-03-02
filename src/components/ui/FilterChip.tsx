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
        px-3.5 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap
        min-h-[44px] sm:min-h-[46px] md:min-h-[48px]
        ${active 
          ? 'bg-padel-500/20 text-padel-500 border-2 border-padel-500 shadow-[0_0_12px_rgba(212,255,0,0.3)]' 
          : 'bg-slate-800 text-slate-300 border-2 border-slate-600 hover:border-slate-500 hover:bg-slate-700'
        }
        ${className}
      `}
    >
      {label}
    </button>
  )
}
