import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { prefetchRoute } from '../components.jsx'
import './Header.css'

const links = [
  ['Our Story', '/our-story'],
  ['What We Do', '/what-we-do'],
  ['Self-Acceptance Hub', '/self-acceptance-hub'],
  ['Stories', '/stories'],
  ['Impact', '/impact'],
  ['Events', '/events'],
  ['Careers', '/careers'],
  ['Resources', '/resources'],
  ['Get Support', '/get-support'],
  ['DONATE', '/donate'],
]

function Brand() {
  return <Link className="brand" to="/" aria-label="Unity Within home">
    <span>UNITY</span> <strong>WITHIN</strong>
  </Link>
}

function NavigationLinks({ onNavigate }) {
  return links.map(([label, to]) => (
    <NavLink
      key={to}
      to={to}
      className={to === '/donate' ? 'site-nav__donate' : undefined}
      onClick={onNavigate}
      onMouseEnter={() => prefetchRoute(to)}
      onTouchStart={() => prefetchRoute(to)}
    >
      {label}
    </NavLink>
  ))
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleRef = useRef(null)
  const navRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    if (!menuOpen) return undefined
    const nav = navRef.current
    if (!nav) return undefined
    const focusable = [...nav.querySelectorAll('a[href], button:not([disabled])')]
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    focusable[0]?.focus()

    const trapFocus = event => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        toggleRef.current?.focus()
        return
      }
      if (event.key !== 'Tab' || !focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && (document.activeElement === first || !nav.contains(document.activeElement))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (document.activeElement === last || !nav.contains(document.activeElement))) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', trapFocus)
    return () => {
      document.removeEventListener('keydown', trapFocus)
      document.body.style.overflow = previousOverflow
    }
  }, [menuOpen])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  return <header className="site-header">
    <div className="wrap header-row">
      <Brand />
      <button
        ref={toggleRef}
        className="menu-toggle"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="primary-navigation"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        onClick={() => setMenuOpen(open => !open)}
      >
        <svg className="menu-toggle__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          {menuOpen ? <path d="m6 6 12 12M18 6 6 18" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
        </svg>
      </button>
      <nav
        ref={navRef}
        className={`site-nav${menuOpen ? ' is-open' : ''}`}
        id="primary-navigation"
        aria-label="Main navigation"
        aria-modal={menuOpen ? 'true' : undefined}
      >
        <NavigationLinks onNavigate={() => setMenuOpen(false)} />
      </nav>
    </div>
  </header>
}
