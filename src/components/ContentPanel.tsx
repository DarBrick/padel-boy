import { ReactNode } from 'react'

interface ContentPanelProps {
  children: ReactNode
  icon?: string
  title?: string
  className?: string
}

export function ContentPanel({ children, icon, title, className = '' }: ContentPanelProps) {
  return (
    <section className={`bg-slate-800/50 border border-[var(--color-padel-yellow)]/50 rounded-lg p-6 md:p-8 transition-colors ${className}`}>
      {(icon || title) && (
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          {icon && <span className="text-[var(--color-padel-yellow)]">{icon}</span>}
          {title}
        </h2>
      )}
      {(icon || title) ? (
        <div className="text-slate-300 leading-relaxed whitespace-pre-line">
          {children}
        </div>
      ) : (
        children
      )}
    </section>
  )
}
