import { useContext } from 'react'
import { PlayerContext } from '../context/PlayerContext.jsx'

function usePlayer() {
  const context = useContext(PlayerContext)
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider')
  }
  return context
}

export { usePlayer }