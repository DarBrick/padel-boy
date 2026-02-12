import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

interface ContentPanelProps {
  children: ReactNode
  icon?: LucideIcon
  title?: string
  className?: string
}

export function ContentPanel({ children, icon: Icon, title, className = '' }: ContentPanelProps) {
  return (
    <section className={`bg-slate-800/50 border border-[var(--color-padel-yellow)]/20 rounded-lg p-3 md:p-6 transition-all duration-200 hover:shadow-xl hover:border-[var(--color-padel-yellow)]/60 ${className}`}>
      {(Icon || title) && (
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          {Icon && <Icon className="w-6 h-6 text-[var(--color-padel-yellow)]" />}
          {title}
        </h2>
      )}
      {(Icon || title) ? (
        <div className="text-slate-300 leading-relaxed whitespace-pre-line">
          {children}
        </div>
      ) : (
        children
      )}
    </section>
  )
}
