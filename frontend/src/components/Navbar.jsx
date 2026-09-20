import { useEffect, useState } from 'react'
import './Navbar.css'
import { getSelectedCollege } from '../features/campus/services/profile-store'

const LINKS = [
  { label: 'Learn', href: '#learn' },
  { label: 'Career', href: '#career' },
  { label: 'Play', href: '#play' },
  { label: 'Tools', href: '#tools' },
]

function Navbar() {
  const [open, setOpen] = useState(false)

  // Campus Hub entry — points at setup until a college is chosen.
  const links = [
    { label: 'Campus', href: getSelectedCollege() ? '#/campus' : '#/setup' },
    ...LINKS,
  ]

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="navbar">
      <a className="navbar__brand" href="#top" aria-label="AiO World home">
        <span className="navbar__mark" aria-hidden="true">
          A
        </span>
        <span className="navbar__name">AiO World</span>
      </a>
      <nav className="navbar__links" aria-label="Primary">
        {links.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </a>
        ))}
      </nav>
      <div className="navbar__auth">
        <a className="navbar__login" href="#login">
          Log in
        </a>
        <button type="button" className="navbar__cta">
          Get started
        </button>
        <button
          type="button"
          className={`navbar__toggle${open ? ' navbar__toggle--open' : ''}`}
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <span className="sr-only">Menu</span>
          <span className="navbar__toggle-bar" aria-hidden="true" />
          <span className="navbar__toggle-bar" aria-hidden="true" />
        </button>
      </div>

      <nav
        id="mobile-menu"
        className={`navbar__mobile${open ? ' navbar__mobile--open' : ''}`}
        aria-label="Mobile"
      >
        {links.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </a>
        ))}
        <a href="#login" onClick={() => setOpen(false)}>
          Log in
        </a>
        <button type="button" onClick={() => setOpen(false)}>
          Get started
        </button>
      </nav>
    </header>
  )
}

export default Navbar