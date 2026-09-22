import { useState } from 'react'
import { Icon } from './Icons'

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/how-it-works', label: 'How it works' },
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/history', label: 'History' },
]

export function AppShell({ children, path, navigate }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const go = (nextPath) => {
    setMenuOpen(false)
    navigate(nextPath)
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container header-inner">
          <button className="brand" onClick={() => go('/')} aria-label="ObjectDNA home">
            <span className="brand-mark"><Icon name="leaf" size={18} strokeWidth={2.4} /></span>
            <span>OBJECT<span>DNA</span></span>
          </button>
          <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
            {navItems.map((item) => (
              <button key={item.path} className={path === item.path ? 'active' : ''} onClick={() => go(item.path)}>{item.label}</button>
            ))}
          </nav>
          <div className="header-actions">
             <button className="header-ghost" onClick={() => go('/impact')}>My impact <Icon name="arrow-up" size={14} /></button>
             <button className="button button-dark header-cta" onClick={() => go('/analyze')}>Analyze an object <Icon name="arrow" size={16} /></button>
            <button className="mobile-menu" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation" aria-expanded={menuOpen}><Icon name={menuOpen ? 'x' : 'menu'} /></button>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <div className="container footer-top">
          <div>
             <button className="brand footer-brand" onClick={() => go('/')}><span className="brand-mark"><Icon name="leaf" size={18} strokeWidth={2.4} /></span><span>OBJECT<span>DNA</span></span></button>
             <p className="footer-tagline">Give every object a next life.</p>
          </div>
          <div className="footer-links">
            {navItems.map((item) => <button key={item.path} onClick={() => go(item.path)}>{item.label}</button>)}
             <button onClick={() => go('/analyze')}>Analyze</button>
          </div>
           <div className="footer-note"><span className="status-dot" />Global Innovation Hackathon 2026<br /><span>Technology for a circular tomorrow</span></div>
        </div>
       <div className="container footer-bottom"><span>AI suggestions are guidance, not a substitute for expert inspection.</span><span>© 2026 ObjectDNA</span></div>
      </footer>
    </div>
  )
}
