import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/report', label: 'Report Issue' },
  { to: '/my-reports', label: 'My Reports' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-top">
          <NavLink to="/" className="brand" onClick={closeMenu}>
            <span className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 32 32">
                <circle cx="16" cy="14" r="5.5" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="16" cy="14" r="1.7" fill="currentColor" />
                <path d="M16 20.2 V26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            VoiceWitness AI
          </NavLink>
          <button
            type="button"
            className="menu-button"
            aria-expanded={menuOpen}
            aria-controls="main-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
        <nav
          id="main-nav"
          className={menuOpen ? 'nav-links open' : 'nav-links'}
          aria-label="Main"
        >
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              onClick={closeMenu}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
