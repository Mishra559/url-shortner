import { Outlet, NavLink } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      {/* Header */}
      <header className="border-b border-border bg-paper sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <NavLink to="/" className="font-display font-bold text-xl text-ink tracking-tight">
            snip<span className="text-accent">.</span>
          </NavLink>
          <nav className="flex items-center gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `font-body text-sm px-4 py-2 transition-colors duration-150 ${
                  isActive ? 'text-ink font-medium' : 'text-muted hover:text-ink'
                }`
              }
            >
              Shorten
            </NavLink>
            <NavLink
              to="/stats"
              className={({ isActive }) =>
                `font-body text-sm px-4 py-2 transition-colors duration-150 ${
                  isActive ? 'text-ink font-medium' : 'text-muted hover:text-ink'
                }`
              }
            >
              Stats
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-cream mt-auto">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <span className="font-mono text-xs text-muted">snip — url shortener</span>
          <span className="font-mono text-xs text-muted">
            built with Spring Boot + React
          </span>
        </div>
      </footer>
    </div>
  )
}
