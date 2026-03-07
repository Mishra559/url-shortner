import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function StatsCard({ stats }) {
  const navigate = useNavigate()

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(stats.shortUrl)
      toast.success('Copied!')
    } catch {
      toast.error('Failed to copy')
    }
  }

  const formatNumber = (n) =>
    n >= 1000 ? (n / 1000).toFixed(1) + 'k' : n.toString()

  return (
    <div className="border border-border bg-white animate-slide-up">
      {/* Header */}
      <div className="border-b border-border px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="tag">/{stats.shortCode}</span>
          <span className="font-body text-xs text-muted">statistics</span>
        </div>
        <button
          onClick={() => navigate('/stats')}
          className="font-mono text-xs text-muted hover:text-ink transition-colors"
        >
          ← back
        </button>
      </div>

      {/* Click count — hero */}
      <div className="px-5 py-8 border-b border-border text-center">
        <p className="font-display text-6xl font-bold text-ink">
          {formatNumber(stats.clickCount)}
        </p>
        <p className="font-body text-sm text-muted mt-2">total clicks</p>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 divide-x divide-border border-b border-border">
        <div className="px-5 py-4">
          <p className="font-mono text-xs text-muted mb-1">created</p>
          <p className="font-body text-sm text-ink">{stats.createdAt}</p>
        </div>
        <div className="px-5 py-4">
          <p className="font-mono text-xs text-muted mb-1">last updated</p>
          <p className="font-body text-sm text-ink">{stats.updatedAt}</p>
        </div>
      </div>

      {/* Short URL */}
      <div className="px-5 py-4 border-b border-border">
        <p className="font-mono text-xs text-muted mb-1">short url</p>
        <div className="flex items-center gap-2 mt-1">
          <a
            href={stats.shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-sm text-accent hover:underline flex-1 truncate"
          >
            {stats.shortUrl}
          </a>
          <button onClick={copy} className="shrink-0 tag hover:border-ink transition-colors cursor-pointer">
            copy
          </button>
        </div>
      </div>

      {/* Original URL */}
      <div className="px-5 py-4">
        <p className="font-mono text-xs text-muted mb-1">original url</p>
        <a
          href={stats.originalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-body text-sm text-muted hover:text-ink break-all line-clamp-3 transition-colors"
        >
          {stats.originalUrl}
        </a>
      </div>
    </div>
  )
}
