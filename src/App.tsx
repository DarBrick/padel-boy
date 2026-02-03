import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LanguageSwitcher } from './components/LanguageSwitcher'
import { Home } from './pages/Home'
import { Setup } from './pages/Setup'
import { Players } from './pages/Players'
import { Tournament } from './pages/Tournament'
import { Standings } from './pages/Standings'

export function App() {
  return (
    <BrowserRouter basename="/padel-boy">
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        {/* Language Switcher */}
        <div className="absolute top-4 right-4 z-30">
          <LanguageSwitcher />
        </div>
        
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/setup" element={<Setup />} />
            <Route path="/players" element={<Players />} />
            <Route path="/tournament" element={<Tournament />} />
            <Route path="/standings" element={<Standings />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
