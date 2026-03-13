import { useState } from 'react'

function ShareLink({ url }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <p className="mb-2 text-sm text-slate-600">Share this challenge link:</p>
      <div className="flex gap-2">
        <input className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm" readOnly value={url} />
        <button className="rounded-md bg-slate-900 px-3 py-1 text-sm text-white" onClick={copy} type="button">
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  )
}

export default ShareLink