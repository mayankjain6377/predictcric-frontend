import CoinBadge from '../ui/CoinBadge.jsx'

function ChallengeCard({ challenge }) {
  return (
    <article className="rounded-lg border border-slate-200 p-4">
      <h3 className="text-lg font-semibold text-slate-900">{challenge.title}</h3>
      <p className="text-sm text-slate-500">Challenge ID: {challenge.id}</p>
      <div className="mt-2">
        <CoinBadge coins={challenge.stake} />
      </div>
    </article>
  )
}

export default ChallengeCard