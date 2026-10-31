import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../GameContext'
import { QUESTIONS } from '../questions'
import TimerRing from '../components/TimerRing'

const TOTAL = QUESTIONS.length

// Vote button colours on host view
const VOTE_COLORS = {
  P:  { bar: 'bg-game-protocol',  badge: 'bg-game-protocol',  text: 'text-cyan-300'  },
  PL: { bar: 'bg-game-platform',  badge: 'bg-game-platform',  text: 'text-orange-300' },
  '?': { bar: 'bg-game-ambiguous', badge: 'bg-game-ambiguous', text: 'text-violet-300' },
}

const VOTE_LABELS = { P: 'Protocol', PL: 'Platform', '?': 'Grey Zone' }

function dist(answers) {
  const c = { P: 0, PL: 0, '?': 0 }
  Object.values(answers || {}).forEach(a => { if (a?.vote) c[a.vote]++ })
  return c
}

function QuestionPills({ current }) {
  return (
    <div className="flex items-center gap-2">
      {QUESTIONS.map((_, i) => (
        <div
          key={i}
          className={`h-2 rounded-full transition-all`}
          style={{
            width: '1.5rem',
            backgroundColor: i < current ? '#00D4AA' : i === current ? '#00D4AA' : 'rgba(255,255,255,0.15)',
            opacity: i < current ? 0.5 : 1,
          }}
        />
      ))}
      <span className="text-game-accent font-bold text-xs ml-1">
        Q{current + 1}/{TOTAL}
      </span>
    </div>
  )
}

export default function HostPage() {
  const navigate = useNavigate()
  const {
    gameState, createGame,
    startQuestion, revealAnswers, nextQuestion,
    showFinal, restartGame,
  } = useGame()

  const [creating,  setCreating]  = useState(false)
  const [created,   setCreated]   = useState(false)
  const [createErr, setCreateErr] = useState(null)

  useEffect(() => {
    if (created) return
    setCreating(true)
    setCreateErr(null)
    createGame()
      .then(() => { setCreated(true); setCreating(false) })
      .catch(err => { setCreating(false); setCreateErr(err?.message || 'Firebase error') })
  }, [])

  // ── Error ───────────────────────────────────────────────────────────────────
  if (createErr) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center max-w-lg px-6">
          <div className="text-5xl mb-4">🔥</div>
          <p className="text-red-400 font-bold text-2xl mb-2">Firebase not responding</p>
          <p className="text-white/40 text-sm font-mono break-all mb-6">{createErr}</p>
          <p className="text-white/30 text-sm mb-3">Firebase Console → Realtime Database → Rules:</p>
          <pre className="bg-white/5 text-green-300 text-xs text-left rounded-xl p-4 mb-6">
{`{
  "rules": {
    "games": {
      "active": {
        ".read": true,
        ".write": true
      }
    }
  }
}`}
          </pre>
          <button
            onClick={() => {
              setCreateErr(null); setCreating(true)
              createGame()
                .then(() => { setCreated(true); setCreating(false) })
                .catch(err => { setCreating(false); setCreateErr(err?.message || 'Firebase error') })
            }}
            className="px-8 py-3 bg-game-accent text-gray-950 rounded-xl font-bold">
            Retry
          </button>
        </div>
      </div>
    )
  }

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (creating || !gameState) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-spin">⚙️</div>
          <p className="text-white/60 text-xl">Creating game…</p>
        </div>
      </div>
    )
  }

  const g         = gameState
  const teamList  = Object.entries(g.teams || {}).map(([id, t]) => ({ id, ...t }))
  const teamCount = teamList.length
  const qi        = g.questionIndex ?? 0
  const q         = QUESTIONS[qi]
  const answers   = g.answers || {}
  const ansCount  = Object.keys(answers).length
  const allIn     = teamCount > 0 && ansCount >= teamCount
  const isLastQ   = qi >= TOTAL - 1
  const joinUrl   = `${window.location.origin}/protocol-or-platform/join`

  // ── LOBBY ───────────────────────────────────────────────────────────────────
  if (g.status === 'lobby') {
    return (
      <div className="h-screen overflow-hidden bg-game-dark flex flex-col p-10">

        {/* Top bar */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-white/40 text-base uppercase tracking-widest">Lecture 9 · RSU</p>
            <h1 className="text-5xl font-black text-white mt-1">Protocol or Platform?</h1>
          </div>
          <div className="flex gap-3">
            <span className="bg-game-protocol/20 text-game-protocol text-2xl font-black px-6 py-2 rounded-full">
              Protocol
            </span>
            <span className="bg-game-platform/20 text-game-platform text-2xl font-black px-6 py-2 rounded-full">
              Platform
            </span>
            <span className="bg-game-ambiguous/20 text-game-ambiguous text-2xl font-black px-6 py-2 rounded-full">
              Grey Zone
            </span>
          </div>
        </div>

        <div className="flex gap-8 flex-1 min-h-0">

          {/* Left: how to play */}
          <div className="flex-1 rounded-3xl bg-white/5 border border-white/10 p-10 flex flex-col gap-8 min-h-0">
            <div>
              <p className="text-game-accent font-black text-3xl mb-3">How to play</p>
              <p className="text-white/70 text-xl leading-relaxed mb-6">
                Each round, you'll see a digital technology or service. As a team, decide: is it an open <strong className="text-game-protocol">Protocol</strong>, a closed <strong className="text-game-platform">Platform</strong>, or something in between (Grey Zone)?
              </p>
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-white font-black text-6xl">{TOTAL}</p>
                  <p className="text-white/40 text-sm uppercase tracking-wider">questions</p>
                </div>
                <div className="text-center">
                  <p className="text-game-accent font-black text-6xl">45s</p>
                  <p className="text-white/40 text-sm uppercase tracking-wider">per question</p>
                </div>
                <div className="text-center">
                  <p className="text-white font-black text-6xl">1</p>
                  <p className="text-white/40 text-sm uppercase tracking-wider">point each</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 flex-1">
              {[
                { key: 'P', emoji: '🌐', label: 'Protocol', desc: 'Open standard. Anyone can implement it. No single owner.', color: 'text-game-protocol', bg: 'bg-game-protocol/10 border-game-protocol/30' },
                { key: 'PL', emoji: '🏰', label: 'Platform', desc: 'Controlled by a company. They set the rules. You\'re the product.', color: 'text-game-platform', bg: 'bg-game-platform/10 border-game-platform/30' },
                { key: '?', emoji: '🌫️', label: 'Grey Zone', desc: 'Hard to classify. Has features of both — discuss!', color: 'text-game-ambiguous', bg: 'bg-game-ambiguous/10 border-game-ambiguous/30' },
              ].map(({ key, emoji, label, desc, color, bg }) => (
                <div key={key} className={`${bg} border rounded-2xl p-6 flex flex-col justify-between`}>
                  <div>
                    <p className="text-4xl mb-2">{emoji}</p>
                    <p className={`${color} font-black text-2xl mb-1`}>{label}</p>
                  </div>
                  <p className="text-white/60 text-base">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: QR + teams + start */}
          <div className="flex flex-col gap-5" style={{ width: '22rem' }}>

            {/* QR */}
            <div className="card flex flex-col items-center gap-3">
              <p className="text-white/50 text-xs font-bold uppercase tracking-widest">Scan to join</p>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(joinUrl)}&bgcolor=FFFFFF&color=000000&margin=8`}
                alt="QR Code"
                className="w-44 h-44 rounded-xl"
              />
              <p className="text-game-accent font-mono text-sm font-bold break-all text-center leading-snug">{joinUrl}</p>
              <p className="text-white/30 text-xs">Enter your team name</p>
            </div>

            {/* Team list */}
            <div className="card flex-1 overflow-y-auto">
              <h3 className="text-white font-black text-2xl mb-4 flex items-center gap-3">
                Teams
                <span className="bg-white/10 text-white/60 text-lg px-3 py-0.5 rounded-full">{teamCount}</span>
              </h3>
              {teamCount === 0 ? (
                <p className="text-white/30 text-lg text-center py-8">Waiting for teams…</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {teamList.map(t => (
                    <div key={t.id} className="flex items-center gap-4 px-4 py-3 rounded-xl bg-white/5">
                      <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ backgroundColor: t.color }} />
                      <span className="text-white font-bold text-xl">{t.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Start */}
            <button
              onClick={() => startQuestion(0, 45)}
              disabled={teamCount === 0}
              className="py-7 text-3xl font-black rounded-2xl bg-game-accent text-gray-950
                         hover:bg-teal-300 transition-all shadow-xl shadow-teal-500/20
                         disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none">
              ▶ Start Game
            </button>
            {teamCount === 0 && (
              <p className="text-white/30 text-sm text-center -mt-3">Need at least 1 team</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── QUESTION ─────────────────────────────────────────────────────────────────
  if (g.status === 'question') {
    const d = dist(answers)

    return (
      <div className="h-screen overflow-hidden bg-gray-950 flex flex-col p-6 gap-4">

        {/* Question + timer */}
        <div className="flex items-start gap-6 flex-shrink-0">
          <div className="flex-1">
            <div className="mb-3">
              <QuestionPills current={qi} />
            </div>
            <p className="text-white font-black text-6xl leading-tight mb-2">{q.item}</p>
            <p className="text-white/60 text-3xl leading-snug">{q.hint}</p>
          </div>
          <div className="flex items-center gap-5 flex-shrink-0 pt-2">
            <div className="text-center">
              <p className="text-white/40 text-xs uppercase tracking-wider">Answers</p>
              <p className="text-white font-black text-6xl tabular-nums leading-none">{ansCount}/{teamCount}</p>
            </div>
            <TimerRing timerEnd={g.timerEnd} totalSecs={45} large />
          </div>
        </div>

        {/* 3 vote options with live counts */}
        <div className="flex flex-col gap-4 flex-1 min-h-0">
          <div className="grid grid-cols-3 gap-4 flex-1">
            {['P', 'PL', '?'].map(vote => {
              const count = d[vote] || 0
              const pct   = teamCount > 0 ? Math.round(count / teamCount * 100) : 0
              const col   = VOTE_COLORS[vote]
              return (
                <div key={vote} className="bg-white/5 rounded-3xl p-6 border border-white/10 flex flex-col justify-between">
                  <div className="flex items-start gap-4 mb-4">
                    <span className={`w-16 h-16 rounded-xl flex items-center justify-center
                                     font-black text-white text-2xl flex-shrink-0 ${col.badge}`}>
                      {vote}
                    </span>
                    <p className="text-white font-bold text-2xl flex-1 leading-snug">{VOTE_LABELS[vote]}</p>
                    <span className="text-white font-black text-5xl tabular-nums leading-none">{count}</span>
                  </div>
                  <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full answer-bar ${col.bar}`}
                         style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>

          <button
            onClick={revealAnswers}
            className={`self-end px-12 py-5 text-2xl font-black rounded-2xl transition-all
              ${allIn
                ? 'bg-game-accent text-gray-950 hover:bg-teal-300 shadow-lg shadow-teal-500/20'
                : 'bg-white/10 text-white border-2 border-white/20 hover:bg-white/20'
              }`}>
            {allIn ? '✓ Reveal Answer' : '⏭ Reveal Now'}
          </button>
        </div>
      </div>
    )
  }

  // ── REVEAL ──────────────────────────────────────────────────────────────────
  if (g.status === 'reveal') {
    const d   = dist(answers)
    const ans = q.answer

    // Projected scores
    const projectedTeams = teamList
      .map(t => {
        const vote = answers[t.id]?.vote
        const isCorrect = ans === '?' ? true : vote === ans
        const gained = isCorrect ? 1 : 0
        return { ...t, gained, projected: (t.score || 0) + gained }
      })
      .sort((a, b) => b.projected - a.projected)

    const correctLabel = VOTE_LABELS[ans] || ans
    const ansColor = VOTE_COLORS[ans]

    return (
      <div className="h-screen overflow-hidden bg-gray-950 flex flex-col p-6 gap-4">

        {/* Correct answer banner */}
        <div className="bg-emerald-500/15 border-2 border-emerald-500 rounded-2xl px-6 py-4
                        flex items-center justify-between flex-shrink-0">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-emerald-400 text-sm font-bold uppercase tracking-widest">
                {ans === '?' ? '🌫️ Grey Zone — Everyone gets a point!' : '✅ Correct Answer'}
              </span>
              <QuestionPills current={qi} />
            </div>
            <p className="text-white font-black text-4xl">
              {q.item} → <span className={ansColor?.text}>{correctLabel}</span>
            </p>
          </div>
          <div className="flex gap-3 items-center">
            {isLastQ ? (
              <button onClick={() => showFinal(qi)}
                className="bg-game-accent text-gray-950 text-lg font-black px-6 py-3
                           rounded-xl hover:bg-teal-300 transition-all shadow-lg shadow-teal-500/20">
                🏆 Final Results
              </button>
            ) : (
              <button onClick={() => nextQuestion(qi)}
                className="bg-game-accent text-gray-950 text-lg font-black px-6 py-3
                           rounded-xl hover:bg-teal-300 transition-all shadow-lg shadow-teal-500/20">
                → Q{qi + 2}
              </button>
            )}
            <button onClick={restartGame}
              className="bg-white/10 text-white/60 text-lg font-bold px-4 py-3
                         rounded-xl border border-white/20 hover:bg-white/20 transition-all">
              🔄
            </button>
          </div>
        </div>

        {/* Explanation + standings */}
        <div className="flex gap-5 flex-1 min-h-0">

          {/* Explanation */}
          <div className="flex-1 card flex flex-col">
            <p className="text-white font-black text-5xl leading-tight mb-4">{q.item}</p>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <p className="text-game-accent font-black text-base mb-3 uppercase tracking-wide">
                  Why {correctLabel}?
                </p>
                <p className="text-white text-xl leading-relaxed mb-6">{q.explanation}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">💬 Discuss</p>
                <p className="text-white/70 text-base leading-relaxed italic">{q.discussionAngle}</p>
              </div>
            </div>
          </div>

          {/* Right: standings + distribution */}
          <div className="w-80 flex flex-col gap-3 flex-shrink-0">
            <p className="text-white/50 text-sm font-bold uppercase tracking-wider">
              📊 Running Scores
            </p>
            {projectedTeams.map((t, i) => (
              <div key={t.id}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2
                  ${i === 0 ? 'bg-game-accent/15 border-game-accent' : 'bg-white/5 border-white/10'}`}>
                <span className="text-2xl w-8 text-center flex-shrink-0">
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : <span className="text-white/40 text-lg">{i+1}</span>}
                </span>
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: t.color }} />
                <span className={`flex-1 font-bold text-base truncate ${i === 0 ? 'text-game-accent' : 'text-white'}`}>
                  {t.name}
                </span>
                <div className="text-right flex-shrink-0">
                  <p className={`font-black text-xl tabular-nums ${i === 0 ? 'text-game-accent' : 'text-white'}`}>
                    {t.projected}
                  </p>
                  {t.gained > 0 && (
                    <p className="text-emerald-400 text-xs font-bold">+{t.gained}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Distribution */}
            <div className="mt-2 bg-white/5 rounded-2xl p-4 border border-white/10">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Vote distribution</p>
              {['P', 'PL', '?'].map(vote => {
                const count = d[vote] || 0
                const pct   = teamCount > 0 ? Math.round(count / teamCount * 100) : 0
                const isCorrect = vote === ans || ans === '?'
                const col = VOTE_COLORS[vote]
                return (
                  <div key={vote} className="flex items-center gap-2 mb-2">
                    <span className={`w-8 h-6 rounded-md flex items-center justify-center
                                     font-black text-white text-xs flex-shrink-0 ${col.badge}`}>{vote}</span>
                    <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${isCorrect ? 'bg-emerald-500' : col.bar}`}
                           style={{ width: `${pct}%` }} />
                    </div>
                    <span className={`font-black text-base tabular-nums w-5 text-right
                      ${isCorrect ? 'text-emerald-400' : 'text-white/60'}`}>{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── FINAL ───────────────────────────────────────────────────────────────────
  if (g.status === 'final') {
    const sorted = [...teamList].sort((a, b) => (b.score || 0) - (a.score || 0))

    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-10">
        <div className="w-full max-w-3xl">
          <div className="text-center mb-10">
            <div className="text-8xl mb-4">🏆</div>
            <h1 className="text-7xl font-black text-white mb-2">FINAL RESULTS</h1>
            <p className="text-white/40 text-2xl">Protocol or Platform? · {TOTAL} questions</p>
          </div>
          <div className="flex flex-col gap-4">
            {sorted.map((t, i) => (
              <div key={t.id}
                className={`flex items-center gap-6 p-6 rounded-3xl border-2 animate-slide-up
                  ${i === 0
                    ? 'bg-game-accent/15 border-game-accent'
                    : 'bg-white/5 border-white/10'}`}
                style={{ animationDelay: `${i * 0.1}s` }}>
                <span className="text-5xl w-16 text-center">
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
                </span>
                <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ backgroundColor: t.color }} />
                <span className={`flex-1 font-black text-4xl ${i === 0 ? 'text-game-accent' : 'text-white'}`}>
                  {t.name}
                </span>
                <span className={`font-black text-5xl tabular-nums ${i === 0 ? 'text-game-accent' : 'text-white'}`}>
                  {t.score || 0}
                </span>
                <span className="text-white/30 text-xl">/{TOTAL}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 mt-10">
            <button onClick={restartGame}
              className="bg-white/10 text-white/60 text-lg font-bold px-6 py-4
                         rounded-2xl border border-white/20 hover:bg-white/20 transition-all">
              🔄 Play Again
            </button>
            <button onClick={() => navigate('/')}
              className="bg-game-accent text-gray-950 text-xl font-black px-10 py-5
                         rounded-2xl hover:bg-teal-300 transition-all
                         shadow-xl shadow-teal-500/20">
              ← Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
