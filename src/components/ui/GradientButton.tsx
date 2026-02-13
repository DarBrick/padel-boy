import type { ReactNode, ButtonHTMLAttributes } from 'react'

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  fullWidth?: boolean
}

export function GradientButton({ 
  children, 
  fullWidth = false,
  className = '',
  disabled = false,
  ...props 
}: GradientButtonProps) {
  return (
    <button
      disabled={disabled}
      className={`
        ${fullWidth ? 'w-full' : ''} 
        py-2.5 px-6 sm:py-3 sm:px-7 md:py-4 md:px-8
        min-h-[44px] sm:min-h-[46px] md:min-h-[48px]
        bg-gradient-to-r from-blue-600 to-[var(--color-padel-yellow)] 
        hover:from-blue-500 hover:to-[#C5F000]
        rounded-lg 
        text-lg font-semibold
        transition-all duration-200
        shadow-lg hover:shadow-xl
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-[var(--color-padel-yellow)]
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
