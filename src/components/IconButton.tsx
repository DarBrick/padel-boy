import { ArrowLeft, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface IconButtonProps {
  onClick: () => void
  label?: string
  icon?: LucideIcon | ReactNode
}

export function IconButton({ onClick, label, icon }: IconButtonProps) {
  const IconComponent = icon || ArrowLeft
  const isLucideIcon = IconComponent && typeof IconComponent !== 'string' && 'render' in (IconComponent as any)
  
  return (
    <button
      onClick={onClick}
      className="
        p-3 
        bg-slate-800 
        hover:bg-slate-700 
        border border-slate-600 
        hover:border-[var(--color-padel-yellow)]
        rounded-full 
        transition-all duration-200
        shadow-lg hover:shadow-xl
        group
      "
      aria-label={label}
    >
      {isLucideIcon ? (
        <IconComponent className="w-6 h-6 text-slate-400 group-hover:text-[var(--color-padel-yellow)] transition-colors" />
      ) : (
        IconComponent
      )}
    </button>
  )
}
