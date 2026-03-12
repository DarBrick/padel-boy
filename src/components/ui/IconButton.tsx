import { ArrowLeft, type LucideIcon } from 'lucide-react'
import { isValidElement, type ReactElement } from 'react'

interface IconButtonProps {
  onClick: () => void
  label?: string
  icon?: LucideIcon | ReactElement
  disabled?: boolean
}

export function IconButton({ onClick, label, icon, disabled = false }: IconButtonProps) {
  if (!icon) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className="
          p-3 
          bg-surface 
          hover:bg-surface-muted 
          border border-border 
          hover:border-padel-500
          rounded-full 
          transition-all duration-200
          shadow-lg hover:shadow-xl
          group
          disabled:cursor-not-allowed
          disabled:opacity-60
          disabled:hover:bg-surface
          disabled:hover:border-border
        "
        aria-label={label}
      >
        <ArrowLeft className="w-6 h-6 text-foreground-muted group-hover:text-padel-500 transition-colors" />
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="
        p-3 
        bg-surface 
        hover:bg-surface-muted 
        border border-border 
        hover:border-padel-500
        rounded-full 
        transition-all duration-200
        shadow-lg hover:shadow-xl
        group
        disabled:cursor-not-allowed
        disabled:opacity-60
        disabled:hover:bg-surface
        disabled:hover:border-border
      "
      aria-label={label}
    >
      {isValidElement(icon) ? (
        icon
      ) : (
        (() => {
          const IconComponent: LucideIcon = icon
          return (
            <IconComponent className="w-6 h-6 text-foreground-muted group-hover:text-padel-500 transition-colors" />
          )
        })()
      )}
    </button>
  )
}
