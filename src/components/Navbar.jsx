import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="container">
        <a href="#" className="navbar-brand">
          <span className="brand-dot" />
          Aksha Digital Foundation
        </a>
        <button
          className="menu-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <ul className={`nav-links${isOpen ? ' open' : ''}`}>
          <li><a href="#mission" onClick={() => setIsOpen(false)}>Mission</a></li>
          <li><a href="#services" onClick={() => setIsOpen(false)}>Services</a></li>
          <li><a href="#portfolio" onClick={() => setIsOpen(false)}>Portfolio</a></li>
          <li><a href="#contact" className="nav-cta" onClick={() => setIsOpen(false)}>Get in Touch</a></li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
