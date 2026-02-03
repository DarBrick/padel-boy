import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-bold text-white mb-8">
        🎾 Padel Boy
      </h1>
      <div className="bg-slate-700/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
        <p className="text-slate-300 mt-6">
            Under construction...
        </p>
      </div>
      <p className="text-slate-400 mt-8">
        Welcome to Padel Boy!
      </p>
    </div>
  )
}

export default App
