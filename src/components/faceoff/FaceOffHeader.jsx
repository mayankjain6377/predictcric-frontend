function FaceOffHeader({ leftName, rightName }) {
  return (
    <header className="rounded-lg bg-slate-900 p-4 text-center text-white">
      <h2 className="text-xl font-bold">{leftName} ⚡ {rightName}</h2>
    </header>
  )
}

export default FaceOffHeader