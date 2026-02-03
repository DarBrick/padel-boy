import { useState } from 'react'
import { PadelBallIcon } from './components/PadelBallIcon'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center p-8">
      <div className="flex items-center gap-4 mb-8">
        <PadelBallIcon className="w-20 h-20" animate={true} />
        <h1 className="text-5xl font-bold text-white">
          Padel Boy
        </h1>
      </div>
      <div className="bg-slate-700/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
        <button 
          onClick={() => setCount((count) => count + 1)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-indigo-500/25"
        >
          Count is {count}
        </button>
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
