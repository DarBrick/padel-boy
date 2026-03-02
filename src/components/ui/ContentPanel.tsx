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
    <section className={`bg-surface/60 border border-border/70 rounded-lg p-3 md:p-6 transition-all duration-200 hover:shadow-xl hover:border-padel-500/60 ${className}`}>
      {(Icon || title) && (
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
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
