function QuestionCard({ question }) {
  return (
    <section className="rounded-lg border border-slate-200 p-4">
      <h3 className="font-semibold text-slate-900">{question.title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {question.options.map((option) => (
          <button className="rounded-md border px-3 py-1 text-sm" key={option} type="button">
            {option}
          </button>
        ))}
      </div>
    </section>
  )
}

export default QuestionCard