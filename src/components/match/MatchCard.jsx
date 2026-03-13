import { Link } from 'react-router-dom'
import { formatDate } from '../../utils/formatDate.js'
import MatchBadge from './MatchBadge.jsx'

function MatchCard({ match }) {
  return (
    <article className="rounded-lg border border-slate-200 p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{match.homeTeam} vs {match.awayTeam}</h3>
        <MatchBadge status={match.status} />
      </div>
      <p className="text-sm text-slate-500">{formatDate(match.startTime)}</p>
      <Link className="mt-3 inline-block text-sm font-semibold text-indigo-600" to={`/matches/${match.id}`}>
        View details
      </Link>
    </article>
  )
}

export default MatchCard