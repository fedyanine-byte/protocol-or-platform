import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGame } from '../GameContext'
import { QUESTIONS } from '../questions'
import TimerRing from '../components/TimerRing'

const VOTE_OPTIONS = [
  {
    id: 'P',
    label: 'Protocol',
    emoji: '🌐',
    gradient: 'from-cyan-600 to-cyan-700',
    border: 'border-cyan-500',
    ring: 'ring-cyan-500',
    desc: 'Open standard, no gatekeeper',
  },
  {
    id: 'PL',
    label: 'Platform',
    emoji: '🏰',
    gradient: 'from-orange-500 to-orange-600',
    border: 'border-orange-400',
    ring: 'ring-orange-400',
    desc: 'Closed, controlled by a company',
  },
  {
    id: '?',
    label: 'Grey Zone',
    emoji: '🌫️',
    gradient: 'from-violet-600 to-violet-700',
    border: 'border-violet-500',
    ring: 'ring-violet-500',
    desc: 'Hard to say — has elements of both',
  },
]

export default function TeamPage() {
  const { teamId } = useParams()
  const navigate   = useNavigate()
  const { gameState, myTeamId, subscribe, submitVote } = useGame()

  const [myVote,     setMyVote]     = useState(null)
  const [submitted,  setSubmitted]  = useState(false)

  useEffect(() => { subscribe() }, [])

  // Reset vote when new question starts
  useEffect(() => {
    if (gameState?.status === 'question') {
      setMyVote(null)
      setSubmitted(false)
    }
  }, [gameState?.status, gameState?.questionIndex])

  const effectiveTeamId = myTeamId || teamId

  const handleVote = (optId) => {
    if (submitted || gameState?.status !== 'question') return
    setMyVote(optId)
    setSubmitted(true)
    submitVote(effectiveTeamId, optId)
  }

  const g      = gameState
  const myTeam = g?.teams?.[effectiveTeamId]

  // ── Connecting ──────────────────────────────────────────────────────────────
  if (!g || !myTeam) {
    return (
      <div className="min-h-screen bg-game-dark flex flex-col items-center justify-center p-6">
        <div className="text-4xl mb-4 animate-pulse">🔀</div>
        <p className="text-white text-lg font-bold">Connecting to game…</p>
        <button onClick={() => navigate('/join')} className="mt-8 text-white/30 text-sm hover:text-white/60">
          ← Re-join
        </button>
      </div>
    )
  }

  const teamColor = myTeam?.color || '#fff'
  const teamName  = myTeam?.name  || 'Your Team'
  const qi        = g.questionIndex ?? 0
  const q         = QUESTIONS[qi]
  const TOTAL     = QUESTIONS.length

  // ── Header (shown in most states) ───────────────────────────────────────────
  const Header = () => (
    <div className="flex items-center gap-3 px-4 py-3 bg-black/30 border-b border-white/10 backdrop-blur">
      <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: teamColor }} />
      <span className="text-white font-bold flex-1">{teamName}</span>
      {(myTeam?.score > 0) && (
        <span className="text-game-accent font-black text-sm">{myTeam.score} pts</span>
      )}
      <span className="text-white/30 text-xs">Q{qi + 1}/{TOTAL}</span>
    </div>
  )

  // ── LOBBY ───────────────────────────────────────────────────────────────────
  if (g.status === 'lobby') {
    const totalTeams = Object.keys(g.teams || {}).length
    return (
      <div className="min-h-screen bg-game-dark flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="text-6xl mb-6">✅</div>
          <h2 className="text-3xl font-black text-white mb-2">You're in!</h2>
          <p className="text-white/50 mb-8">Waiting for the game to start…</p>

          <div className="bg-white/5 border border-white/10 rounded-2xl px-8 py-5 mb-6">
            <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Your team</p>
            <div className="flex items-center gap-3 justify-center">
              <div className="w-5 h-5 rounded-full" style={{ backgroundColor: teamColor }} />
              <p className="text-white font-black text-2xl">{teamName}</p>
            </div>
          </div>

          <div className="bg-game-accent/10 border border-game-accent/30 rounded-2xl px-6 py-4 mb-6 max-w-xs">
            <p className="text-game-accent font-bold text-sm">{TOTAL} questions · 1 pt each</p>
            <p className="text-white/50 text-xs mt-1">45 seconds per question</p>
          </div>

          <p className="text-white/30 text-sm">{totalTeams} team{totalTeams !== 1 ? 's' : ''} joined</p>
          <div className="mt-8 flex gap-2">
            {[0,1,2,3].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-white/20 animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── QUESTION ────────────────────────────────────────────────────────────────
  if (g.status === 'question') {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col">
        <Header />

        {/* Question */}
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-start gap-4">
            <TimerRing timerEnd={g.timerEnd} totalSecs={45} />
            <div className="flex-1 min-w-0">
              <p className="text-game-accent text-xs font-bold uppercase tracking-wider mb-1">
                Q{qi + 1}/{TOTAL} · What is this?
              </p>
              <p className="text-white font-black text-xl leading-snug">{q.item}</p>
              <p className="text-white/50 text-sm mt-1 leading-snug">{q.hint}</p>
            </div>
          </div>
        </div>

        {/* Vote buttons */}
        <div className="flex-1 px-4 pb-6 flex flex-col gap-3 mt-2">
          {submitted ? (
            <div className="flex flex-col items-center justify-center flex-1 gap-4">
              <div className="text-5xl">✅</div>
              <p className="text-white font-bold text-xl">Vote submitted!</p>
              {(() => {
                const opt = VOTE_OPTIONS.find(o => o.id === myVote)
                return (
                  <div className={`bg-gradient-to-br ${opt.gradient} border ${opt.border} rounded-2xl
                                   px-8 py-5 ring-4 ${opt.ring} w-full max-w-xs text-center`}>
                    <p className="text-4xl mb-1">{opt.emoji}</p>
                    <p className="text-white font-black text-2xl">{opt.label}</p>
                  </div>
                )
              })()}
              <p className="text-white/40 text-sm">Waiting for other teams…</p>
            </div>
          ) : (
            VOTE_OPTIONS.map(opt => (
              <button
                key={opt.id}
                onClick={() => handleVote(opt.id)}
                className={`bg-gradient-to-br ${opt.gradient} border ${opt.border} rounded-2xl p-5
                            flex items-center gap-4 w-full
                            active:scale-95 transition-transform`}
              >
                <span className="text-4xl">{opt.emoji}</span>
                <div className="text-left">
                  <p className="text-white font-black text-2xl">{opt.label}</p>
                  <p className="text-white/70 text-sm">{opt.desc}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    )
  }

  // ── REVEAL ──────────────────────────────────────────────────────────────────
  if (g.status === 'reveal') {
    const correctAnswer = q.answer
    const isAmbiguous   = correctAnswer === '?'
    const isCorrect     = isAmbiguous ? true : myVote === correctAnswer
    const didAnswer     = !!myVote
    const correctOpt    = VOTE_OPTIONS.find(o => o.id === correctAnswer)

    return (
      <div className="min-h-screen bg-gray-950 flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center gap-5">

          {didAnswer ? (
            <>
              <div className="text-7xl">{isCorrect ? '🎉' : '😬'}</div>
              <div>
                <p className={`text-4xl font-black mb-1 ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isAmbiguous ? 'Grey Zone!' : isCorrect ? 'Correct!' : 'Not quite'}
                </p>
                <p className="text-white/50">
                  {isCorrect
                    ? '+1 point'
                    : `Correct answer: ${correctOpt?.label}`}
                </p>
              </div>
              {correctOpt && (
                <div className={`rounded-2xl px-6 py-4 border w-full max-w-sm
                  ${isCorrect ? 'bg-emerald-500/15 border-emerald-500' : 'bg-white/5 border-white/10'}`}>
                  <p className="text-2xl mb-2">{correctOpt.emoji}</p>
                  <p className={`font-bold text-lg ${isCorrect ? 'text-emerald-300' : 'text-white'}`}>
                    {q.item} → {correctOpt.label}
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="text-6xl">⏱️</div>
              <p className="text-white font-bold text-2xl">Time's up!</p>
              <p className="text-white/50">You didn't vote</p>
              {correctOpt && (
                <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 w-full max-w-sm">
                  <p className="text-game-accent font-bold">
                    {correctOpt.emoji} Correct: {correctOpt.label}
                  </p>
                </div>
              )}
            </>
          )}

          <p className="text-white/30 text-sm mt-2">Watch the screen for the explanation</p>
        </div>
      </div>
    )
  }

  // ── FINAL ───────────────────────────────────────────────────────────────────
  if (g.status === 'final') {
    const sorted  = Object.entries(g.teams || {})
      .map(([id, t]) => ({ id, ...t }))
      .sort((a, b) => (b.score || 0) - (a.score || 0))
    const myRank  = sorted.findIndex(t => t.id === effectiveTeamId) + 1
    const myScore = myTeam?.score || 0

    return (
      <div className="min-h-screen bg-gray-950 flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col p-5 gap-4">

          {/* My result */}
          <div className={`rounded-2xl p-5 border text-center
            ${myRank === 1 ? 'bg-game-accent/15 border-game-accent' : 'bg-white/5 border-white/10'}`}>
            <div className="text-5xl mb-2">
              {myRank === 1 ? '🥇' : myRank === 2 ? '🥈' : myRank === 3 ? '🥉' : `#${myRank}`}
            </div>
            <p className={`font-black text-2xl ${myRank === 1 ? 'text-game-accent' : 'text-white'}`}>{teamName}</p>
            <p className="text-white/60 text-sm mt-1">{myScore}/{QUESTIONS.length} correct</p>
          </div>

          {/* Full board */}
          <div className="flex flex-col gap-2">
            {sorted.map((t, i) => (
              <div key={t.id}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border
                  ${t.id === effectiveTeamId
                    ? 'bg-white/10 border-white/30'
                    : 'bg-white/5 border-white/10'}`}>
                <span className="text-white/40 w-6 text-sm text-center">
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                </span>
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: t.color }} />
                <span className={`flex-1 font-bold ${t.id === effectiveTeamId ? 'text-white' : 'text-white/70'}`}>
                  {t.name}
                </span>
                <span className={`font-black tabular-nums ${i === 0 ? 'text-game-accent' : 'text-white'}`}>
                  {t.score || 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // fallback
  return (
    <div className="min-h-screen bg-game-dark flex items-center justify-center">
      <p className="text-white/40">Loading...</p>
    </div>
  )
}
