import { useState } from 'react'

function useChallenge() {
  const [challengeId, setChallengeId] = useState('')

  const createChallenge = () => {
    const id = `challenge_${Date.now()}`
    setChallengeId(id)
    return id
  }

  return { challengeId, createChallenge }
}

export { useChallenge }