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
    <section className={`bg-surface/60 border border-border/70 rounded-lg p-4 sm:p-5 md:p-6 transition-all duration-200 hover:shadow-xl hover:border-padel-500/60 ${className}`}>
      {(Icon || title) && (
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground sm:text-2xl">
          {Icon && <Icon className="w-6 h-6 text-padel-500" />}
          {title}
        </h2>
      )}
      {(Icon || title) ? (
        <div className="text-foreground-muted leading-relaxed whitespace-pre-line">
          {children}
        </div>
      ) : (
        children
      )}
    </section>
  )
}
