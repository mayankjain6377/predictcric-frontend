function PredictionSummary({ answers }) {
  return (
    <ul className="space-y-2">
      {answers.map((item) => (
        <li className="rounded-md border border-slate-200 p-3" key={item.question}>
          <p className="text-sm text-slate-500">{item.question}</p>
          <p className="font-semibold text-slate-900">{item.selected}</p>
        </li>
      ))}
    </ul>
  )
}

export default PredictionSummary