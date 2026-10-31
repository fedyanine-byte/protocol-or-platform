import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import HostPage from './pages/HostPage'
import JoinPage from './pages/JoinPage'
import TeamPage from './pages/TeamPage'

export default function App() {
  return (
    <Routes>
      <Route path="/"              element={<HomePage />} />
      <Route path="/host"          element={<HostPage />} />
      <Route path="/join"          element={<JoinPage />} />
      <Route path="/team/:teamId"  element={<TeamPage />} />
      <Route path="*"              element={<Navigate to="/" replace />} />
    </Routes>
  )
}
