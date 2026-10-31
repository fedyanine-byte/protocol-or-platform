import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../GameContext'

export default function JoinPage() {
  const navigate = useNavigate()
  const { joinGame } = useGame()
  const [teamName, setTeamName] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleJoin = async (e) => {
    e.preventDefault()
    setError('')
    const name = teamName.trim()
    if (!name)            { setError('Enter your team name.'); return }
    if (name.length > 24) { setError('Max 24 characters.'); return }

    setLoading(true)
    try {
      const { teamId } = await joinGame(name)
      navigate(`/team/${teamId}`)
    } catch (err) {
      setError(err.message || 'Could not connect.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-game-dark flex flex-col items-center justify-center p-6">
      <div className="text-center mb-10">
        <div className="text-6xl mb-4">🔀</div>
        <h1 className="text-4xl font-black text-white">PROTOCOL OR PLATFORM?</h1>
        <p className="text-white/50 text-lg mt-2">Digital Economy Game</p>
      </div>

      <form onSubmit={handleJoin} className="w-full max-w-sm flex flex-col gap-5">
        <div>
          <label className="block text-white/60 text-sm font-semibold uppercase tracking-wider mb-3">
            Team Name
          </label>
          <input
            type="text"
            value={teamName}
            onChange={e => setTeamName(e.target.value)}
            maxLength={24}
            placeholder="e.g. Digital Eagles"
            className="w-full bg-white/10 border-2 border-white/20 text-white text-2xl
                       font-bold rounded-2xl px-5 py-5
                       focus:outline-none focus:border-game-accent placeholder-white/20"
            autoComplete="off"
            autoFocus
          />
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/40 text-red-300 rounded-xl px-4 py-3">
            ⚠️ {error}
          </div>
        )}

        <button type="submit" disabled={loading || !teamName.trim()}
          className="btn-primary text-xl py-5 mt-1">
          {loading ? '⏳ Joining...' : '→ Join Game'}
        </button>
      </form>

      <button onClick={() => navigate('/')}
        className="mt-10 text-white/30 text-sm hover:text-white/60 transition-colors">
        ← Back
      </button>
    </div>
  )
}
