import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-32 text-center animate-fade-in">
      <p className="font-display font-bold text-8xl text-border mb-4">404</p>
      <h1 className="font-display font-bold text-2xl text-ink mb-3">Page not found</h1>
      <p className="font-body text-sm text-muted mb-8">
        This page doesn't exist. Maybe the link expired, or you mistyped the URL.
      </p>
      <Link to="/" className="btn-primary inline-flex items-center gap-2">
        ← Back to home
      </Link>
    </div>
  )
}
