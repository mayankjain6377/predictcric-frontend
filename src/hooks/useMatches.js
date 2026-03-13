import { useEffect, useState } from 'react'
import api from '../api/axios.js'

function useMatches() {
  const [matches, setMatches] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const getMatches = async () => {
      setIsLoading(true)
      setError('')
      try {
        const response = await api.get('/matches')
        setMatches(response.data || [])
      } catch {
        setError('Failed to load matches')
      } finally {
        setIsLoading(false)
      }
    }

    getMatches()
  }, [])

  return { matches, isLoading, error }
}

export { useMatches }