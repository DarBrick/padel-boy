import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Navbar } from './components/layout'
import { CookieBanner } from './components/layout'
import { Home } from './pages/Home'
import { Create } from './pages/Create'
import { Tournament } from './pages/Tournament'
import { Standings } from './pages/Standings'
import { PastTournaments } from './pages/PastTournaments'
import { SharedTournament } from './pages/SharedTournament'
import { Privacy } from './pages/Privacy'
import { Terms } from './pages/Terms'
import { Help } from './pages/Help'
import { Roadmap } from './pages/Roadmap'
import { Settings } from './pages/Settings'
import { Players } from './pages/Players'

// Smart detection: Use /padel-boy only for github.io subdirectory deployment
const isGitHubPagesSubdirectory = window.location.hostname.includes('github.io') && 
                                   window.location.pathname.startsWith('/padel-boy')
const basename = isGitHubPagesSubdirectory ? '/padel-boy' : '/'

export function App() {
  return (
    <BrowserRouter basename={basename}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        {/* Navigation Bar */}
        <Navbar />
        
        <div className="container mx-auto px-4 pt-24 pb-8 max-w-4xl">
          <Routes>
            <Route index element={<Home />} />
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<Create />} />
            <Route path="/tournament/:id" element={<Tournament />} />
            <Route path="/shared/:data" element={<SharedTournament />} />
            <Route path="/past" element={<PastTournaments />} />
            <Route path="/standings" element={<Standings />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/help" element={<Help />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/players" element={<Players />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {/* Cookie Banner */}
        <CookieBanner />
        
        {/* Toast Notifications */}
        <Toaster position="top-center" theme="dark" richColors duration={2500} />
      </div>
    </BrowserRouter>
  )
}

export default App
