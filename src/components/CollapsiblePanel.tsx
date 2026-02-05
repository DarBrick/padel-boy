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
    <div className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-4 sm:p-5 md:p-6 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
      >
        <span className="text-lg font-semibold">
          {icon}
          {label} <span className="text-slate-400">({value})</span>
        </span>
        <span className="text-slate-400">
          {isExpanded ? '▲' : '▼'}
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
