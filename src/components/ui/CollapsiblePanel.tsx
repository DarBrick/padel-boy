import { ChevronDown, ChevronUp } from 'lucide-react'
import type { ReactNode } from 'react'

interface CollapsiblePanelProps {
  icon: ReactNode
  label: string
  value: string | number
  isExpanded: boolean
  onToggle: () => void
  children: ReactNode
}

export function CollapsiblePanel({
  icon,
  label,
  value,
  isExpanded,
  onToggle,
  children,
}: CollapsiblePanelProps) {
  return (
    <div className="bg-surface/60 rounded-lg border border-border/70 overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-4 sm:p-5 md:p-6 flex items-center justify-between hover:bg-surface-muted/70 transition-colors"
      >
        <span className="text-lg font-semibold">
          {icon}
          {label} <span className="text-foreground-muted">({value})</span>
        </span>
        <span className="text-foreground-muted">
          {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </span>
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-4 sm:px-5 sm:pb-5 md:px-6 md:pb-6">
          {children}
        </div>
      )}
    </div>
  )
}
