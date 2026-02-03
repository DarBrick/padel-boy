import type { ReactNode, ButtonHTMLAttributes } from 'react'

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  fullWidth?: boolean
}

export function GradientButton({ 
  children, 
  fullWidth = false,
  className = '',
  ...props 
}: GradientButtonProps) {
  return (
    <button
      className={`
        ${fullWidth ? 'w-full' : ''} 
        py-4 px-8
        bg-gradient-to-r from-blue-600 to-[#D4FF00] 
        hover:from-blue-500 hover:to-[#C5F000]
        rounded-lg 
        text-lg font-semibold
        transition-all duration-200
        shadow-lg hover:shadow-xl
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
