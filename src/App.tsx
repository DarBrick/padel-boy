import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LanguageSwitcher } from './components/LanguageSwitcher'
import { CookieBanner } from './components/CookieBanner'
import { Home } from './pages/Home'
import { Create } from './pages/Create'
import { Tournament } from './pages/Tournament'
import { Standings } from './pages/Standings'
import { PastTournaments } from './pages/PastTournaments'
import { Privacy } from './pages/Privacy'
import { Terms } from './pages/Terms'
import { Help } from './pages/Help'
import { Roadmap } from './pages/Roadmap'

// Smart detection: Use /padel-boy only for github.io subdirectory deployment
const isGitHubPagesSubdirectory = window.location.hostname.includes('github.io') && 
                                   window.location.pathname.startsWith('/padel-boy')
const basename = isGitHubPagesSubdirectory ? '/padel-boy' : '/'

export function App() {
  return (
    <BrowserRouter basename={basename}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        {/* Language Switcher */}
        <div className="absolute top-4 right-4 z-30">
          <LanguageSwitcher />
        </div>
        
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Routes>
            <Route index element={<Home />} />
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<Create />} />
            <Route path="/tournament/:id" element={<Tournament />} />
            <Route path="/past" element={<PastTournaments />} />
            <Route path="/standings" element={<Standings />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/help" element={<Help />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {/* Cookie Banner */}
        <CookieBanner />
      </div>
    </BrowserRouter>
  )
}

export default App
