import { Link } from 'react-router-dom'
import './Footer.css'

const currentYear = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-inner container">
        <div className="footer-grid">
          {/* Brand column */}
          <div className="footer-brand-col">
            <div className="footer-brand">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <rect width="32" height="32" rx="6" fill="#4A9EFF" fillOpacity="0.1" />
                <rect x="1" y="1" width="30" height="30" rx="5" stroke="#4A9EFF" strokeOpacity="0.4" strokeWidth="1" />
                <path d="M8 12h4l2 4 2-4h4" stroke="#4A9EFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 20h16M11 16h10" stroke="#C7CED6" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
                <circle cx="16" cy="12" r="2" fill="#4A9EFF" fillOpacity="0.8"/>
              </svg>
              <span className="footer-brand-name">SKM Tooling Center</span>
            </div>
            <p className="footer-description">
              Specialising in precision tooling, mould components, and engineered solutions for demanding industrial applications.
            </p>
          </div>

          {/* Navigation */}
          <div className="footer-col">
            <h3 className="footer-col-title">Navigation</h3>
            <nav aria-label="Footer navigation">
              <Link to="/" className="footer-link">Home</Link>
              <Link to="/about" className="footer-link">About</Link>
              <Link to="/products" className="footer-link">Products</Link>
              <Link to="/contact" className="footer-link">Contact</Link>
            </nav>
          </div>

          {/* Products */}
          <div className="footer-col">
            <h3 className="footer-col-title">Products</h3>
            <nav aria-label="Product categories">
              <Link to="/products?category=Core+Inserts" className="footer-link">Core Inserts</Link>
              <Link to="/products?category=Cavity+Plates" className="footer-link">Cavity Plates</Link>
              <Link to="/products?category=Moulding+Tools" className="footer-link">Moulding Tools</Link>
              <Link to="/products?category=Case+Cover+Plates" className="footer-link">Case Cover Plates</Link>
              <Link to="/products?category=Tooling+Components" className="footer-link">Tooling Components</Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h3 className="footer-col-title">Get in Touch</h3>
            <p className="footer-contact-text">
              Ready to discuss your tooling requirements?
            </p>
            <Link to="/quote" className="btn btn--primary btn--sm footer-cta" id="footer-quote-btn">
              Request a Quote
            </Link>
            <Link to="/contact" className="btn btn--ghost btn--sm footer-cta" id="footer-contact-btn">
              Contact Us
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <span>© {currentYear} SKM Tooling Center. All rights reserved.</span>
          </div>
          <div className="footer-bottom-right">
            <Link to="/privacy" className="footer-legal-link">Privacy Policy</Link>
            <span className="footer-divider">·</span>
            <span className="footer-built-with">Precision. Performance. Reliability.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
