import { SITE_CONTACT } from '../../config/contact'
import './FloatingWhatsApp.css'

export default function FloatingWhatsApp() {
  return (
    <aside aria-label="Quick WhatsApp Contact" className="floating-whatsapp-container">
      <a
        href={SITE_CONTACT.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-whatsapp-btn"
        aria-label={`Chat on WhatsApp with ${SITE_CONTACT.companyName} at ${SITE_CONTACT.whatsappNumber}`}
        id="floating-whatsapp-cta"
      >
        <span className="floating-whatsapp-pulse" aria-hidden="true" />
        <svg
          className="floating-whatsapp-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* Official WhatsApp SVG path */}
          <path
            d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
            fill="#25D366"
            stroke="#25D366"
          />
          <path
            d="M9.5 9c-.3 0-.6.2-.8.5-.3.4-.9 1.4-.9 2.5 0 1.2.8 2.4 1 2.6.2.2 1.6 2.5 4 3.4 2 .8 2.4.6 2.8.5.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.3-.2-.7-.4s-2.1-1-2.4-1.2c-.3-.1-.5-.2-.7.2s-.8 1-1 1.2c-.2.2-.4.2-.7.1-.4-.2-1.5-.6-2.5-1.5-.8-.7-1.3-1.6-1.5-1.9-.2-.3 0-.5.1-.7.1-.2.3-.4.5-.6.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6s-.6-1.6-.9-2.2c-.2-.6-.5-.5-.7-.5z"
            fill="#FFFFFF"
          />
        </svg>
        <span className="floating-whatsapp-label">Chat on WhatsApp</span>
      </a>
    </aside>
  )
}
