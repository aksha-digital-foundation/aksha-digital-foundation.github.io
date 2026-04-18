import { Mail, MapPin } from 'lucide-react'

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">Aksha Digital Foundation</div>
            <p className="footer-desc">
              Democratizing the power of AI and digital technology for
              underserved communities worldwide.
            </p>
          </div>
          <div>
            <h4>Links</h4>
            <ul>
              <li><a href="#mission">Mission</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#portfolio">Portfolio</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={14} />
                <a href="mailto:hello@aksha-digital-foundation.com">hello@aksha-digital-foundation.com</a>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                <MapPin size={14} />
                <span>United States</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Aksha Digital Foundation LLC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
