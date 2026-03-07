import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function UrlResult({ result, onReset }) {
  const [showQr, setShowQr] = useState(false)
  const navigate = useNavigate()

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result.shortUrl)
      toast.success('Copied to clipboard!')
    } catch {
      toast.error('Failed to copy')
    }
  }

  const truncate = (str, n = 60) =>
    str.length > n ? str.slice(0, n) + '…' : str

  return (
    <div className="animate-slide-up">
      {/* Result card */}
      <div className="border border-ink bg-ink text-paper">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse-dot" />
            <span className="font-mono text-xs text-white/50">link generated</span>
          </div>
          <button
            onClick={onReset}
            className="font-mono text-xs text-white/40 hover:text-white transition-colors"
          >
            ✕ new
          </button>
        </div>

        {/* Short URL */}
        <div className="px-4 py-5 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-display font-semibold text-lg text-white break-all">
              {result.shortUrl}
            </p>
            <p className="font-body text-xs text-white/40 mt-1 truncate">
              → {truncate(result.originalUrl)}
            </p>
          </div>

          {/* Copy button */}
          <button
            onClick={copyToClipboard}
            className="shrink-0 border border-white/20 hover:border-white/50 px-4 py-2 font-mono text-xs text-white transition-colors flex items-center gap-2"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M2 8V2h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            copy
          </button>
        </div>

        {/* Actions */}
        <div className="px-4 pb-4 flex items-center gap-2 border-t border-white/10 pt-3">
          <button
            onClick={() => setShowQr(!showQr)}
            className="font-mono text-xs text-white/50 hover:text-white transition-colors flex items-center gap-1"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="1" y="1" width="4" height="4" stroke="currentColor" strokeWidth="1.2"/>
              <rect x="7" y="1" width="4" height="4" stroke="currentColor" strokeWidth="1.2"/>
              <rect x="1" y="7" width="4" height="4" stroke="currentColor" strokeWidth="1.2"/>
              <rect x="8.5" y="8.5" width="1.5" height="1.5" fill="currentColor"/>
            </svg>
            {showQr ? 'hide qr' : 'show qr'}
          </button>

          <span className="text-white/20">·</span>

          <button
            onClick={() => navigate(`/stats/${result.shortCode}`)}
            className="font-mono text-xs text-white/50 hover:text-white transition-colors flex items-center gap-1"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 9l3-3 2 2 3-4 2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            view stats
          </button>

          <span className="text-white/20">·</span>

          <a
            href={result.shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-white/50 hover:text-white transition-colors flex items-center gap-1"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M5 2H2a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M8 1h3v3M11 1L6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            open
          </a>
        </div>
      </div>

      {/* QR Code Panel */}
      {showQr && (
        <div className="mt-0 border border-t-0 border-ink p-6 bg-white flex flex-col items-center gap-3 animate-fade-in">
          <QRCodeSVG
            value={result.shortUrl}
            size={160}
            bgColor="#ffffff"
            fgColor="#0D0D0D"
            level="M"
          />
          <p className="font-mono text-xs text-muted">Scan to open {result.shortUrl}</p>
        </div>
      )}
    </div>
  )
}
