import type { ReactNode } from 'react'

interface FormSectionProps {
  children: ReactNode
  className?: string
}

export function FormSection({ children, className = '' }: FormSectionProps) {
  return (
    <div className={`rounded-lg border border-border/70 bg-surface/60 p-4 sm:p-5 md:p-6 ${className}`}>
      {children}
    </div>
  )
}
