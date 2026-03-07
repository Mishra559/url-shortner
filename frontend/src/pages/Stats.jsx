import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import StatsCard from '../components/StatsCard'
import { getStats } from '../services/api'

export default function Stats() {
  const { code } = useParams()
  const [shortCode, setShortCode] = useState(code || '')
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  // Auto-load if code in URL
  useEffect(() => {
    if (code) {
      fetchStats(code)
    }
  }, [code])

  const fetchStats = async (codeToFetch) => {
    const target = (codeToFetch || shortCode).trim()
    if (!target) {
      toast.error('Enter a short code')
      return
    }
    setLoading(true)
    setSearched(true)
    try {
      const data = await getStats(target)
      setStats(data)
    } catch (err) {
      toast.error(err.message)
      setStats(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    fetchStats()
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-10 animate-fade-in">
        <h1 className="font-display font-bold text-4xl text-ink tracking-tight mb-2">
          Link Statistics
        </h1>
        <p className="font-body text-sm text-muted">
          Enter a short code to view click data and metadata.
        </p>
      </div>

      {/* Search form */}
      <form onSubmit={handleSubmit} className="mb-8 animate-slide-up">
        <div className="flex gap-0 border border-border bg-white focus-within:border-ink transition-colors">
          <div className="flex items-center px-3 bg-cream border-r border-border">
            <span className="font-mono text-xs text-muted whitespace-nowrap select-none">snip.io/</span>
          </div>
          <input
            type="text"
            value={shortCode}
            onChange={(e) => setShortCode(e.target.value)}
            placeholder="abc123"
            className="flex-1 bg-transparent px-4 py-4 font-mono text-sm text-ink placeholder:text-muted outline-none"
            autoFocus={!code}
          />
          <button
            type="submit"
            disabled={loading || !shortCode.trim()}
            className="btn-primary min-w-[110px] flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Look up</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="5" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.3"/>
                  <path d="M8 8l2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Results */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-ink border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && stats && (
        <StatsCard stats={stats} />
      )}

      {!loading && searched && !stats && (
        <div className="border border-border bg-cream p-8 text-center animate-fade-in">
          <p className="font-display text-2xl font-semibold text-ink mb-2">Not found</p>
          <p className="font-body text-sm text-muted">
            No link found for <span className="font-mono">/{shortCode}</span>
          </p>
        </div>
      )}

      {!searched && !loading && (
        <div className="border border-dashed border-border p-10 text-center animate-fade-in">
          <svg className="mx-auto mb-4 text-border" width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect x="4" y="8" width="32" height="24" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M12 20h16M12 26h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="20" cy="14" r="3" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          <p className="font-body text-sm text-muted">Enter a short code above to see its stats</p>
        </div>
      )}
    </div>
  )
}
