function ComparisonRow({ question, leftCorrect, rightCorrect }) {
  return (
    <div className="grid grid-cols-3 items-center gap-2 rounded-md border border-slate-200 p-3">
      <span className="text-center text-xl">{leftCorrect ? '✅' : '❌'}</span>
      <span className="text-center text-sm font-medium text-slate-700">{question}</span>
      <span className="text-center text-xl">{rightCorrect ? '✅' : '❌'}</span>
    </div>
  )
}

export default ComparisonRow