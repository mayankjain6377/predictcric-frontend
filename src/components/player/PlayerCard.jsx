import CoinBadge from '../ui/CoinBadge.jsx'

function PlayerCard({ player }) {
  return (
    <article className="rounded-lg border border-slate-200 p-4">
      <h3 className="text-lg font-semibold text-slate-900">{player.name}</h3>
      <p className="text-sm text-slate-500">ID: {player.id}</p>
      <div className="mt-2">
        <CoinBadge coins={player.coins} />
      </div>
    </article>
  )
}

export default PlayerCard