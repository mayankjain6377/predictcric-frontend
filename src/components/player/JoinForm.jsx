import { useState } from 'react'
import { usePlayer } from '../../hooks/usePlayer.js'
import Button from '../ui/Button.jsx'

function JoinForm() {
  const [name, setName] = useState('')
  const { setPlayer } = usePlayer()

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!name.trim()) return

    const playerId = `${name.trim().toUpperCase().slice(0, 4)}_${Math.floor(100 + Math.random() * 900)}`
    setPlayer({ name: name.trim(), playerId })
    setName('')
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <label className="block text-sm font-medium text-slate-700" htmlFor="name">
        Enter your name
      </label>
      <input
        className="w-full rounded-md border border-slate-300 px-3 py-2"
        id="name"
        onChange={(event) => setName(event.target.value)}
        placeholder="Priya"
        value={name}
      />
      <Button type="submit">Join Now</Button>
    </form>
  )
}

export default JoinForm