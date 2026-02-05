interface ToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
}

export function ToggleSwitch({ checked, onChange, label, disabled = false }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative w-20 h-10 rounded-full transition-all duration-300 flex-shrink-0 border-2 flex items-center ${
        checked 
          ? 'bg-gradient-to-r from-slate-600 to-slate-500 shadow-[0_0_20px_rgba(212,255,0,0.2)] border-slate-500' 
          : 'border-slate-600'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      aria-label={label}
      aria-checked={checked}
      role="switch"
    >
      <div
        className={`w-8 h-8 rounded-full transition-all duration-300 ${
          checked ? 'ml-11' : 'ml-1'
        }`}
        style={{
          background: `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 8 2 Q 12 8, 8 16 Q 4 24, 8 30' stroke='white' stroke-width='2' fill='none' opacity='0.8'/%3E%3Cpath d='M 24 2 Q 20 8, 24 16 Q 28 24, 24 30' stroke='white' stroke-width='2' fill='none' opacity='0.8'/%3E%3C/svg%3E"), radial-gradient(circle at 30% 30%, #E5FF33, var(--color-padel-yellow) 45%, #B8D400)`,
          boxShadow: checked 
            ? 'inset -2px -2px 4px rgba(0, 0, 0, 0.2), inset 2px 2px 4px rgba(255, 255, 255, 0.3), 0 4px 12px rgba(212, 255, 0, 0.4), 0 0 20px rgba(212, 255, 0, 0.3)'
            : 'inset -2px -2px 4px rgba(0, 0, 0, 0.2), inset 2px 2px 4px rgba(255, 255, 255, 0.3), 0 2px 8px rgba(0, 0, 0, 0.3)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
        }}
      />
    </button>
  )
}
