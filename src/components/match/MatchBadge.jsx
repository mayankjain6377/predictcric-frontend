function MatchBadge({ status }) {
  const live = status === 'LIVE'
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${live ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
      {status}
    </span>
  )
}

export default MatchBadge