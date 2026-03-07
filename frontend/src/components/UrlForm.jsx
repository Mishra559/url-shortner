import { useState } from 'react'

export default function UrlForm({ onSubmit, loading }) {
  const [url, setUrl] = useState('')
  const [alias, setAlias] = useState('')
  const [showAlias, setShowAlias] = useState(false)
  const [error, setError] = useState('')

  const validate = (value) => {
    try {
      const u = new URL(value)
      if (!['http:', 'https:'].includes(u.protocol)) return 'URL must start with http:// or https://'
      return ''
    } catch {
      return 'Please enter a valid URL'
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const err = validate(url.trim())
    if (err) {
      setError(err)
      return
    }
    setError('')
    onSubmit(url.trim(), alias.trim() || null)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full animate-slide-up">
      {/* URL Input Row */}
      <div className="flex gap-0 border border-border bg-white focus-within:border-ink transition-colors">
        <input
          type="text"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value)
            if (error) setError('')
          }}
          placeholder="https://your-very-long-url.com/goes/here"
          className="flex-1 bg-transparent px-4 py-4 font-body text-sm text-ink placeholder:text-muted outline-none"
          autoFocus
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="btn-primary min-w-[120px] flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Working…</span>
            </>
          ) : (
            <>
              <span>Shorten</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <p className="mt-2 font-body text-xs text-accent">{error}</p>
      )}

      {/* Custom alias toggle */}
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setShowAlias(!showAlias)}
          className="font-body text-xs text-muted hover:text-ink transition-colors flex items-center gap-1"
        >
          <svg
            width="12" height="12" viewBox="0 0 12 12" fill="none"
            className={`transition-transform duration-200 ${showAlias ? 'rotate-90' : ''}`}
          >
            <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Custom alias
        </button>
      </div>

      {showAlias && (
        <div className="mt-2 flex items-center gap-0 border border-border bg-white animate-fade-in">
          <span className="px-3 py-3 font-mono text-xs text-muted border-r border-border bg-cream whitespace-nowrap select-none">
            snip.io/
          </span>
          <input
            type="text"
            value={alias}
            onChange={(e) => setAlias(e.target.value.replace(/[^a-zA-Z0-9-]/g, ''))}
            placeholder="my-custom-link"
            maxLength={20}
            className="flex-1 bg-transparent px-3 py-3 font-mono text-sm text-ink placeholder:text-muted outline-none"
            disabled={loading}
          />
        </div>
      )}
    </form>
  )
}
