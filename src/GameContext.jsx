import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { db } from './firebase'
import { ref, set, update, onValue, get, push } from 'firebase/database'
import { QUESTIONS } from './questions'

const GameCtx = createContext(null)

const FIXED_CODE = 'active'

const TEAM_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#06b6d4', '#6366f1', '#ec4899', '#14b8a6',
]

export function GameProvider({ children }) {
  const [gameState, setGameState] = useState(null)
  const [myTeamId,  setMyTeamId]  = useState(null)
  const unsubRef = useRef(null)

  const subscribe = useCallback(() => {
    if (unsubRef.current) unsubRef.current()
    const gameRef = ref(db, `games/${FIXED_CODE}`)
    unsubRef.current = onValue(gameRef, (snap) => {
      if (snap.exists()) setGameState(snap.val())
    })
  }, [])

  useEffect(() => () => { if (unsubRef.current) unsubRef.current() }, [])

  const createGame = async () => {
    await set(ref(db, `games/${FIXED_CODE}`), {
      status:        'lobby',
      questionIndex: 0,
      createdAt:     Date.now(),
    })
    subscribe()
  }

  const joinGame = async (teamName) => {
    const snap = await get(ref(db, `games/${FIXED_CODE}`))
    if (!snap.exists()) throw new Error('Game not found. Try again later.')
    const game = snap.val()
    if (game.status !== 'lobby') throw new Error('Game already started.')

    const usedColors = Object.values(game.teams || {}).map(t => t.color)
    const color = TEAM_COLORS.find(c => !usedColors.includes(c))
              || TEAM_COLORS[Math.floor(Math.random() * TEAM_COLORS.length)]

    const teamRef = push(ref(db, `games/${FIXED_CODE}/teams`))
    const teamId  = teamRef.key
    await set(teamRef, { name: teamName, color, score: 0 })

    setMyTeamId(teamId)
    subscribe()
    return { teamId, color }
  }

  // Start a new question (secs = timer duration)
  const startQuestion = (qi, secs = 45) =>
    update(ref(db, `games/${FIXED_CODE}`), {
      status:        'question',
      questionIndex: qi,
      questionStarted: Date.now(),
      timerEnd:      Date.now() + secs * 1000,
      answers:       null,
    })

  const revealAnswers = () =>
    update(ref(db, `games/${FIXED_CODE}`), { status: 'reveal' })

  const nextQuestion = async (qi) => {
    // Score current question before advancing
    const q = QUESTIONS[qi]
    const snap = await get(ref(db, `games/${FIXED_CODE}`))
    const game  = snap.val()
    const teams = { ...(game.teams || {}) }

    Object.entries(game.answers || {}).forEach(([tid, a]) => {
      const isCorrect = q.answer === '?' ? true : a.vote === q.answer
      if (isCorrect) {
        teams[tid] = { ...teams[tid], score: (teams[tid]?.score || 0) + 1 }
      }
    })

    await update(ref(db, `games/${FIXED_CODE}`), {
      status:        'question',
      questionIndex: qi + 1,
      questionStarted: Date.now(),
      timerEnd:      Date.now() + 45 * 1000,
      answers:       null,
      teams,
    })
  }

  const showFinal = async (lastQi) => {
    const q = QUESTIONS[lastQi]
    const snap = await get(ref(db, `games/${FIXED_CODE}`))
    const game  = snap.val()
    const teams = { ...(game.teams || {}) }

    Object.entries(game.answers || {}).forEach(([tid, a]) => {
      const isCorrect = q.answer === '?' ? true : a.vote === q.answer
      if (isCorrect) {
        teams[tid] = { ...teams[tid], score: (teams[tid]?.score || 0) + 1 }
      }
    })

    await update(ref(db, `games/${FIXED_CODE}`), { status: 'final', teams })
  }

  const restartGame = () =>
    update(ref(db, `games/${FIXED_CODE}`), {
      status:        'lobby',
      questionIndex: 0,
      answers:       null,
      timerEnd:      null,
    })

  const submitVote = (teamId, vote) => {
    return set(ref(db, `games/${FIXED_CODE}/answers/${teamId}`), {
      vote,
      submittedAt: Date.now(),
    })
  }

  return (
    <GameCtx.Provider value={{
      gameState, myTeamId,
      createGame, joinGame, subscribe,
      startQuestion, revealAnswers, nextQuestion,
      showFinal, restartGame, submitVote,
    }}>
      {children}
    </GameCtx.Provider>
  )
}

export const useGame = () => useContext(GameCtx)
