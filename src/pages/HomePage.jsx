import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-game-dark flex flex-col items-center justify-center p-6">

      {/* Icon / badge */}
      <div className="mb-8">
        <div className="w-24 h-24 rounded-3xl bg-game-accent/20 border-2 border-game-accent/40
                        flex items-center justify-center text-5xl drop-shadow-2xl">
          🔀
        </div>
      </div>

      {/* Title */}
      <h1 className="text-5xl font-black text-white tracking-tight mb-1 text-center">
        PROTOCOL OR PLATFORM?
      </h1>
      <p className="text-game-accent text-lg font-semibold mb-2 text-center tracking-widest uppercase">
        Digital Economy · Live Game
      </p>
      <p className="text-white/40 text-sm mb-12 text-center">
        Open Standards · Walled Gardens · Internet Architecture
      </p>

      {/* Mode selector */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <button
          onClick={() => navigate('/host')}
          className="flex-1 bg-game-accent text-gray-950 font-black text-xl py-5 px-8
                     rounded-2xl hover:bg-teal-300 active:scale-95 transition-all
                     shadow-lg shadow-teal-500/20 flex flex-col items-center gap-1"
        >
          <span className="text-3xl">📽️</span>
          <span>HOST GAME</span>
          <span className="font-normal text-sm opacity-60">Presenter / Projector</span>
        </button>

        <button
          onClick={() => navigate('/join')}
          className="flex-1 bg-white/10 text-white font-black text-xl py-5 px-8
                     rounded-2xl hover:bg-white/20 active:scale-95 transition-all
                     border-2 border-white/20 flex flex-col items-center gap-1"
        >
          <span className="text-3xl">📱</span>
          <span>JOIN GAME</span>
          <span className="font-normal text-sm opacity-60">Student / Team</span>
        </button>
      </div>

      <p className="text-white/20 text-xs mt-10">
        Lecture 9 · Riga Stradiņš University · Digital Economy
      </p>
    </div>
  )
}
