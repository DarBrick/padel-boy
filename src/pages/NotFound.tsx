import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home } from 'lucide-react'
import { GradientButton } from '../components/ui'
import { Footer } from '../components/layout'

export function NotFound() {
  const navigate = useNavigate()

  useEffect(() => {
    // Update document title and meta tags for SEO
    document.title = '404 - Page Not Found | Padel Boy'
    
    // Add noindex meta tag
    const metaRobots = document.createElement('meta')
    metaRobots.name = 'robots'
    metaRobots.content = 'noindex, nofollow'
    document.head.appendChild(metaRobots)

    // Cleanup on unmount
    return () => {
      document.title = 'Padel Boy - Organize Your Padel Tournaments'
      document.head.removeChild(metaRobots)
    }
  }, [])

  const handleGoHome = () => {
    navigate('/', { replace: true })
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center text-center space-y-6 sm:space-y-7 md:space-y-8 py-12 sm:py-16 md:py-20">
        {/* 404 Hero */}
        <div className="space-y-4">
          <h1 className="text-8xl sm:text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-[var(--color-padel-yellow)] to-white bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-200">
            Page Not Found
          </h2>
        </div>

        {/* Description */}
        <p className="text-slate-400 text-base sm:text-lg max-w-md px-4">
          The page you're looking for doesn't exist or has been moved. Let's get you back on the court!
        </p>

        {/* Action Button */}
        <GradientButton
          onClick={handleGoHome}
          className="flex items-center gap-2 min-h-[44px] sm:min-h-[46px] md:min-h-[48px]"
        >
          <Home className="w-5 h-5" />
          Go to Homepage
        </GradientButton>
      </div>

      {/* Footer */}
      <Footer />
    </>
  )
}
