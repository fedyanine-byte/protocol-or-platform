import { useState, useEffect } from 'react'

export function useTimer(timerEnd) {
  const [secondsLeft, setSecondsLeft] = useState(null)

  useEffect(() => {
    if (!timerEnd) { setSecondsLeft(null); return }

    const tick = () => {
      const s = Math.max(0, Math.ceil((timerEnd - Date.now()) / 1000))
      setSecondsLeft(s)
    }
    tick()
    const id = setInterval(tick, 200)
    return () => clearInterval(id)
  }, [timerEnd])

  const isUrgent  = secondsLeft !== null && secondsLeft <= 10
  const isWarning = secondsLeft !== null && secondsLeft <= 20 && !isUrgent

  return { secondsLeft, isUrgent, isWarning }
}
