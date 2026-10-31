import { db } from './firebase.js'
import { ref, set, get, onValue, update } from 'firebase/database'
import { QUESTIONS, TOTAL_QUESTIONS } from './questions.js'

// ── State ──────────────────────────────────────────────────────────────────
let myTeam = null
let myVote = null
let isHost = false
let liveUnsubscribe = null

const GAME_KEY = 'active'
const gameRef = () => ref(db, `games/${GAME_KEY}`)

// ── Screens ────────────────────────────────────────────────────────────────
const screens = ['landing','join','waiting','vote','reveal-student','student-final',
                 'host-lobby','host-question','host-reveal','host-final']

function show(id) {
  screens.forEach(s => {
    const el = document.getElementById(s)
    if (el) el.style.display = s === id ? 'flex' : 'none'
  })
}

// ── Landing ────────────────────────────────────────────────────────────────
window.showJoin = () => show('join')
window.showHost = () => {
  isHost = true
  show('host-lobby')
  document.getElementById('join-url').textContent = window.location.href.split('?')[0]
  listenGame()
}

// ── Student Join ───────────────────────────────────────────────────────────
window.joinGame = async () => {
  const name = document.getElementById('team-input').value.trim()
  const err  = document.getElementById('join-err')
  if (!name) { err.textContent = 'Please enter a team name'; return }

  // Check game state
  const snap = await get(gameRef())
  const game = snap.val() || {}
  if (game.phase === 'final') { err.textContent = 'Game is over. Ask the host to reset.'; return }

  myTeam = name
  // Register team with score 0 if not present
  const teamRef = ref(db, `games/${GAME_KEY}/teams/${name}`)
  const tsnap = await get(teamRef)
  if (!tsnap.exists()) {
    await set(teamRef, { score: 0, joined: Date.now() })
  }

  show('waiting')
  document.getElementById('waiting-team').textContent = name
  listenGame()
}

// ── Listen to game state ───────────────────────────────────────────────────
function listenGame() {
  if (liveUnsubscribe) liveUnsubscribe()
  liveUnsubscribe = onValue(gameRef(), snap => {
    const game = snap.val() || {}
    if (isHost) {
      renderHostState(game)
    } else {
      renderStudentState(game)
    }
  })
}

// ── Student state machine ──────────────────────────────────────────────────
function renderStudentState(game) {
  if (!myTeam) return
  const phase = game.phase || 'lobby'

  if (phase === 'lobby') {
    show('waiting')
    return
  }

  if (phase === 'question') {
    myVote = null
    const q = QUESTIONS[game.currentQ]
    document.getElementById('v-number').textContent = `Question ${game.currentQ + 1} of ${TOTAL_QUESTIONS}`
    document.getElementById('v-item').textContent = q.item
    document.getElementById('v-hint').textContent = q.hint

    // Check if already voted
    const myAnswer = game.answers?.[myTeam]
    if (myAnswer) {
      renderVotedMessage(myAnswer, q.answer)
    } else {
      // Show vote buttons — include ? button for ambiguous questions
      const btns = document.getElementById('vote-btns')
      btns.innerHTML = `
        <button class="vote-btn proto" onclick="castVote('P')">🔌<span class="label">Protocol</span></button>
        <button class="vote-btn plat"  onclick="castVote('PL')">🏰<span class="label">Platform</span></button>
      `
      if (q.answer === '?') {
        btns.style.gridTemplateColumns = '1fr 1fr 1fr'
        btns.innerHTML += `<button class="vote-btn grey-btn" onclick="castVote('?')">🤔<span class="label">Both / Neither</span></button>`
      } else {
        btns.style.gridTemplateColumns = '1fr 1fr'
      }
      show('vote')
    }
    return
  }

  if (phase === 'reveal') {
    const q = QUESTIONS[game.currentQ]
    const myAnswer = game.answers?.[myTeam]
    const correct = myAnswer === q.answer || q.answer === '?'
    const myScore = game.teams?.[myTeam]?.score || 0

    const el = document.getElementById('reveal-student')
    const tagClass = q.answer === 'P' ? 'tag-proto' : q.answer === 'PL' ? 'tag-plat' : 'tag-grey'
    const answerLabel = q.answer === 'P' ? '🔌 Protocol' : q.answer === 'PL' ? '🏰 Platform' : '🤔 Deliberately Ambiguous'

    let resultClass = correct ? 'result-correct' : myAnswer ? 'result-wrong' : 'result-neutral'
    let icon = correct ? '✅' : myAnswer ? '❌' : '⏱️'
    let label = correct ? 'Correct!' : myAnswer ? 'Not quite' : "Time's up"
    if (q.answer === '?') { resultClass = 'result-neutral'; icon = '🤔'; label = 'All answers accepted — this one is genuinely grey' }

    el.innerHTML = `
      <div class="${resultClass}" style="width:100%;max-width:440px">
        <div class="result-icon">${icon}</div>
        <div class="result-label">${label}</div>
        <div style="margin:.3rem 0"><span class="reveal-answer-tag ${tagClass}">${answerLabel}</span></div>
        <div class="result-explanation">${q.explanation}</div>
        <div class="score-chip">Your score: ${myScore} pts</div>
      </div>
    `
    show('reveal-student')
    return
  }

  if (phase === 'final') {
    const teams = game.teams || {}
    const sorted = Object.entries(teams).sort((a,b) => b[1].score - a[1].score)
    const myScore = teams[myTeam]?.score || 0
    const myRank  = sorted.findIndex(([n]) => n === myTeam) + 1

    document.getElementById('sf-score').textContent = myScore + ' pts'
    document.getElementById('sf-sub').textContent = `Rank #${myRank} of ${sorted.length} teams`

    const board = document.getElementById('sf-board')
    board.innerHTML = sorted.map(([name, data], i) => `
      <div class="fr ${name === myTeam ? 'me' : ''}">
        <span>#${i+1} ${name}</span>
        <span>${data.score} pts</span>
      </div>
    `).join('')

    show('student-final')
  }
}

function renderVotedMessage(myAnswer, correct) {
  const voteEl = document.getElementById('vote-btns')
  const label = myAnswer === 'P' ? '🔌 Protocol' : myAnswer === 'PL' ? '🏰 Platform' : '🤔 Both/Neither'
  voteEl.innerHTML = `
    <div class="voted-msg" style="grid-column:1/-1">
      <div class="big">✓</div>
      <p>Voted: <strong>${label}</strong></p>
      <p style="margin-top:.5rem">Waiting for other teams…</p>
    </div>
  `
  show('vote')
}

// ── Cast vote ──────────────────────────────────────────────────────────────
window.castVote = async (choice) => {
  if (myVote) return
  myVote = choice

  const snap = await get(gameRef())
  const game = snap.val() || {}
  const q = QUESTIONS[game.currentQ]

  // Award points: 1 pt for correct, 0 for wrong, 1 for ambiguous (all win)
  const correct = choice === q.answer || q.answer === '?'
  const pts = correct ? 1 : 0

  await update(ref(db, `games/${GAME_KEY}`), {
    [`answers/${myTeam}`]: choice,
    [`teams/${myTeam}/score`]: (game.teams?.[myTeam]?.score || 0) + pts
  })
}

// ── Host lobby render ──────────────────────────────────────────────────────
function renderHostState(game) {
  const phase = game.phase || 'lobby'
  const teams = game.teams || {}
  const teamNames = Object.keys(teams)

  if (phase === 'lobby') {
    show('host-lobby')
    document.getElementById('team-count').textContent = teamNames.length
    document.getElementById('teams-grid').innerHTML = teamNames
      .map(n => `<div class="team-chip">${n}</div>`).join('')
    return
  }

  if (phase === 'question') {
    show('host-question')
    const q = QUESTIONS[game.currentQ]
    document.getElementById('hq-meta').textContent = `Question ${game.currentQ + 1} / ${TOTAL_QUESTIONS}`
    document.getElementById('hq-item').textContent = q.item
    document.getElementById('hq-hint').textContent = q.hint

    // Live vote tally
    const answers = game.answers || {}
    const protoTeams = [], platTeams = [], greyTeams = []
    Object.entries(answers).forEach(([name, vote]) => {
      if (vote === 'P') protoTeams.push(name)
      else if (vote === 'PL') platTeams.push(name)
      else greyTeams.push(name)
    })
    const total = teamNames.length
    const voted = Object.keys(answers).length

    const greyCol = q.answer === '?' ? `
      <div class="answer-col grey-col">
        <div class="col-label">Both/Neither</div>
        <div class="col-count">${greyTeams.length}</div>
        <div class="col-teams">${greyTeams.join(', ')}</div>
      </div>` : ''

    document.getElementById('answer-split').innerHTML = `
      <div class="answer-col proto-col">
        <div class="col-label">🔌 Protocol</div>
        <div class="col-count">${protoTeams.length}</div>
        <div class="col-teams">${protoTeams.join(', ')}</div>
      </div>
      <div class="answer-col plat-col">
        <div class="col-label">🏰 Platform</div>
        <div class="col-count">${platTeams.length}</div>
        <div class="col-teams">${platTeams.join(', ')}</div>
      </div>
      ${greyCol}
    `

    // Timer bar (cosmetic — counts down 45s from question start)
    const elapsed = (Date.now() - (game.questionStarted || Date.now())) / 1000
    const pct = Math.max(0, 100 - (elapsed / 45) * 100)
    document.getElementById('timer-bar').style.width = pct + '%'
    return
  }

  if (phase === 'reveal') {
    renderHostReveal(game)
    return
  }

  if (phase === 'final') {
    renderHostFinal(game)
  }
}

function renderHostReveal(game) {
  show('host-reveal')
  const q = QUESTIONS[game.currentQ]
  const teams = game.teams || {}
  const sorted = Object.entries(teams).sort((a,b) => b[1].score - a[1].score)

  const tagClass = q.answer === 'P' ? 'tag-proto' : q.answer === 'PL' ? 'tag-plat' : 'tag-grey'
  const answerLabel = q.answer === 'P' ? '🔌 Protocol' : q.answer === 'PL' ? '🏰 Platform' : '🤔 Deliberately Ambiguous'

  const isLast = game.currentQ >= TOTAL_QUESTIONS - 1

  const el = document.getElementById('host-reveal')
  el.innerHTML = `
    <div style="flex:1;overflow-y:auto">
      <span class="reveal-answer-tag ${tagClass}">${answerLabel}</span>
      <div class="reveal-item">${q.item}</div>
      <div class="reveal-explanation">${q.explanation}</div>
      <div class="reveal-discussion"><strong>💬 Discussion angle:</strong> ${q.discussionAngle}</div>
      <div style="margin-top:1.2rem">
        <p style="font-size:.85rem;color:#aaa;letter-spacing:.08em;text-transform:uppercase;margin-bottom:.6rem">Standings</p>
        <div class="scoreboard">
          ${sorted.map(([name, data], i) => `
            <div class="score-row ${i===0?'top':''}">
              <span class="sname">${i===0?'🥇 ':''}${name}</span>
              <span class="spts">${data.score} pts</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
    <div class="ctrl-bar">
      ${isLast
        ? `<button class="ctrl-btn ctrl-start" onclick="hostFinish()">🏆 Show Final Results</button>`
        : `<button class="ctrl-btn ctrl-next" onclick="hostNextQuestion()">Next Question →</button>`
      }
    </div>
  `
}

function renderHostFinal(game) {
  show('host-final')
  const teams = game.teams || {}
  const sorted = Object.entries(teams).sort((a,b) => b[1].score - a[1].score)

  // Podium (top 3)
  const medals = ['🥇','🥈','🥉']
  const pClasses = ['p1','p2','p3']
  const heights = [120,85,60]
  const podiumOrder = [sorted[1], sorted[0], sorted[2]].filter(Boolean) // 2nd, 1st, 3rd
  const podiumActual = [sorted[0], sorted[1], sorted[2]].filter(Boolean)

  document.getElementById('podium').innerHTML = [
    podiumActual[1] ? `<div class="podium-col"><div class="podium-block p2" style="height:85px">🥈</div><div class="podium-name">${podiumActual[1][0]}</div><div class="podium-pts">${podiumActual[1][1].score} pts</div></div>` : '',
    podiumActual[0] ? `<div class="podium-col"><div class="podium-block p1" style="height:120px">🥇</div><div class="podium-name">${podiumActual[0][0]}</div><div class="podium-pts">${podiumActual[0][1].score} pts</div></div>` : '',
    podiumActual[2] ? `<div class="podium-col"><div class="podium-block p3" style="height:60px">🥉</div><div class="podium-name">${podiumActual[2][0]}</div><div class="podium-pts">${podiumActual[2][1].score} pts</div></div>` : '',
  ].join('')

  document.getElementById('final-board').innerHTML = sorted.map(([name, data], i) => `
    <div class="score-row ${i===0?'top':''}">
      <span class="sname">${medals[i] || (i+1+'.')} ${name}</span>
      <span class="spts">${data.score} / ${TOTAL_QUESTIONS} pts</span>
    </div>
  `).join('')
}

// ── Host controls ──────────────────────────────────────────────────────────
window.hostStartGame = async () => {
  await set(gameRef(), {
    phase: 'question',
    currentQ: 0,
    questionStarted: Date.now(),
    answers: {},
    teams: await getExistingTeams()
  })
}

async function getExistingTeams() {
  const snap = await get(ref(db, `games/${GAME_KEY}/teams`))
  return snap.val() || {}
}

window.hostReveal = async () => {
  await update(gameRef(), { phase: 'reveal' })
}

window.hostNextQuestion = async () => {
  const snap = await get(gameRef())
  const game = snap.val() || {}
  const next = (game.currentQ || 0) + 1
  await update(gameRef(), {
    phase: 'question',
    currentQ: next,
    questionStarted: Date.now(),
    answers: {}
  })
}

window.hostFinish = async () => {
  await update(gameRef(), { phase: 'final' })
}

window.hostReset = async () => {
  await set(gameRef(), { phase: 'lobby', teams: {} })
  myTeam = null
  myVote = null
  if (!isHost) show('landing')
}

// ── Init ───────────────────────────────────────────────────────────────────
show('landing')
