import type { ReactNode } from 'react'

interface FormSectionProps {
  children: ReactNode
  className?: string
}

export function FormSection({ children, className = '' }: FormSectionProps) {
  return (
    <div className={`bg-slate-800/50 rounded-lg border border-slate-700 p-4 sm:p-5 md:p-6 ${className}`}>
      {children}
    </div>
  )
}
