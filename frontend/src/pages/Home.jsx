import { useState } from 'react'
import toast from 'react-hot-toast'
import UrlForm from '../components/UrlForm'
import UrlResult from '../components/UrlResult'
import { createShortUrl } from '../services/api'

const EXAMPLES = [
  'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all',
  'https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project',
  'https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/concurrent/CompletableFuture.html',
]

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleSubmit = async (originalUrl, customAlias) => {
    setLoading(true)
    try {
      const data = await createShortUrl(originalUrl, customAlias)
      setResult(data)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      {/* Hero */}
      <div className="mb-12 animate-fade-in">
        <div className="flex items-center gap-2 mb-6">
          <span className="tag">v1.0</span>
          <span className="font-mono text-xs text-muted">free · fast · open source</span>
        </div>
        <h1 className="font-display font-bold text-5xl text-ink leading-[1.05] tracking-tight mb-4">
          Long URLs,<br />
          <span className="text-accent">cut short.</span>
        </h1>
        <p className="font-body text-base text-muted max-w-md leading-relaxed">
          Paste any URL. Get a short, shareable link in seconds.
          Track clicks, generate QR codes, add custom aliases.
        </p>
      </div>

      {/* Form / Result */}
      {result ? (
        <UrlResult result={result} onReset={() => setResult(null)} />
      ) : (
        <UrlForm onSubmit={handleSubmit} loading={loading} />
      )}

      {/* Example URLs */}
      {!result && (
        <div className="mt-10 animate-fade-in" style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}>
          <p className="font-mono text-xs text-muted mb-3">try these examples</p>
          <div className="flex flex-col gap-2">
            {EXAMPLES.map((url, i) => (
              <button
                key={i}
                onClick={() => handleSubmit(url, null)}
                disabled={loading}
                className="text-left font-body text-xs text-muted hover:text-ink transition-colors truncate group"
              >
                <span className="text-border group-hover:text-accent transition-colors mr-2">→</span>
                {url}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Feature pills */}
      <div className="mt-16 flex flex-wrap gap-2 animate-fade-in" style={{ animationDelay: '0.3s', opacity: 0, animationFillMode: 'forwards' }}>
        {['Click tracking', 'QR codes', 'Custom aliases', 'Redis caching', 'REST API'].map(f => (
          <span key={f} className="font-mono text-xs text-muted border border-border px-3 py-1 bg-cream">
            {f}
          </span>
        ))}
      </div>
    </div>
  )
}
