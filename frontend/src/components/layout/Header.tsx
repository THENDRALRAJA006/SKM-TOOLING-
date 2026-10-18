import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronRight } from 'lucide-react'
import './Header.css'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/products', label: 'Products' },
  { to: '/contact', label: 'Contact' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

  return (
    <header className={`site-header${scrolled ? ' site-header--scrolled' : ''}`} role="banner">
      <div className="header-inner container">
        {/* Logo / Wordmark */}
        <Link to="/" className="header-brand" aria-label="SKM Tooling Center — Home">
          <div className="brand-mark">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <rect width="32" height="32" rx="6" fill="#4A9EFF" fillOpacity="0.1" />
              <rect x="1" y="1" width="30" height="30" rx="5" stroke="#4A9EFF" strokeOpacity="0.4" strokeWidth="1" />
              <path d="M8 12h4l2 4 2-4h4" stroke="#4A9EFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 20h16M11 16h10" stroke="#C7CED6" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
              <circle cx="16" cy="12" r="2" fill="#4A9EFF" fillOpacity="0.8"/>
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-name">SKM Tooling Center</span>
            <span className="brand-tagline">Precision Engineering</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="header-nav" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link${isActive(link.to) ? ' nav-link--active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="header-cta">
          <Link to="/quote" className="btn btn--primary btn--sm" id="header-quote-btn">
            Request a Quote
            <ChevronRight size={14} />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        ref={menuRef}
        className={`mobile-menu${mobileOpen ? ' mobile-menu--open' : ''}`}
        aria-hidden={!mobileOpen}
      >
        <nav aria-label="Mobile navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`mobile-nav-link${isActive(link.to) ? ' mobile-nav-link--active' : ''}`}
              tabIndex={mobileOpen ? 0 : -1}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/quote"
            className="btn btn--primary w-full mt-6"
            id="mobile-quote-btn"
            tabIndex={mobileOpen ? 0 : -1}
          >
            Request a Quote
          </Link>
        </nav>
      </div>
    </header>
  )
}
