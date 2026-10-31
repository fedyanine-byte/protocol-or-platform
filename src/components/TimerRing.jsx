import { useTimer } from '../hooks/useTimer'

const R = 44
const CIRC = 2 * Math.PI * R

export default function TimerRing({ timerEnd, totalSecs = 45, large = false }) {
  const { secondsLeft, isUrgent, isWarning } = useTimer(timerEnd)

  if (secondsLeft === null) return null

  const fraction = Math.min(1, secondsLeft / totalSecs)
  const offset   = CIRC * (1 - fraction)
  const color    = isUrgent ? '#ef4444' : isWarning ? '#f59e0b' : '#00D4AA'
  const size     = large ? 'w-28 h-28 text-4xl' : 'w-20 h-20 text-2xl'

  return (
    <div className={`relative flex items-center justify-center ${size}`}>
      <svg className="absolute inset-0 w-full h-full timer-ring" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={R}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={offset}
          className="timer-ring-progress"
          style={{ transition: 'stroke-dashoffset 0.2s linear, stroke 0.3s' }}
        />
      </svg>
      <span className={`font-black tabular-nums z-10 ${isUrgent ? 'animate-pulse-fast text-red-400' : 'text-white'}`}>
        {secondsLeft}
      </span>
    </div>
  )
}
