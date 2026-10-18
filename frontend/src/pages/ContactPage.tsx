import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, ChevronRight, Clock } from 'lucide-react'
import './ContactPage.css'

const CONTACT_FIELDS = [
  { icon: <Mail size={20} />, label: 'Email', value: null, placeholder: '[Email address to be provided by SKM Tooling Center]' },
  { icon: <Phone size={20} />, label: 'Phone', value: null, placeholder: '[Phone number to be provided by SKM Tooling Center]' },
  { icon: <MapPin size={20} />, label: 'Address', value: null, placeholder: '[Business address to be provided by SKM Tooling Center]' },
  { icon: <Clock size={20} />, label: 'Hours', value: null, placeholder: '[Operating hours to be provided by SKM Tooling Center]' },
]

export default function ContactPage() {
  return (
    <>
      <title>Contact | SKM Tooling Center</title>
      <meta name="description" content="Contact SKM Tooling Center to discuss your precision tooling requirements, request a quotation, or ask about our products." />

      <div className="contact-page">
        {/* Page hero */}
        <div className="page-hero">
          <div className="tech-grid" aria-hidden="true" />
          <div className="container page-hero-content">
            <p className="section-label">Contact</p>
            <h1 className="section-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Get in Touch
            </h1>
            <p className="section-description mx-auto" style={{ textAlign: 'center' }}>
              Ready to discuss your tooling requirements? We would like to hear from you.
            </p>
          </div>
        </div>

        <div className="container" style={{ paddingBlock: 'var(--space-16)' }}>
          <div className="contact-layout">
            {/* Info column */}
            <div className="contact-info">
              <h2 className="contact-info-title">Contact Information</h2>
              <p className="contact-info-desc">
                Verified contact details for SKM Tooling Center will appear here once configured.
                Use the quotation form to send us your requirements directly.
              </p>

              <div className="contact-details">
                {CONTACT_FIELDS.map((field) => (
                  <div key={field.label} className="contact-detail-item">
                    <div className="contact-detail-icon">{field.icon}</div>
                    <div className="contact-detail-content">
                      <span className="contact-detail-label">{field.label}</span>
                      {field.value ? (
                        <span className="contact-detail-value">{field.value}</span>
                      ) : (
                        <span className="contact-detail-placeholder">{field.placeholder}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="contact-config-note">
                <p>
                  Business owners: log in to the{' '}
                  <Link to="/admin">admin dashboard</Link>{' '}
                  to update these contact details with verified information.
                </p>
              </div>

              <div className="contact-quote-promo">
                <h3 className="contact-quote-promo-title">Have a Project in Mind?</h3>
                <p>Submit a detailed quotation request and our team will review your requirements.</p>
                <Link to="/quote" className="btn btn--primary" id="contact-quote-btn">
                  Request a Quote
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="contact-map-placeholder">
              <div className="map-placeholder-inner">
                <MapPin size={48} style={{ color: 'var(--text-faint)' }} />
                <p className="map-placeholder-text">
                  Location map will be added when a verified business address is provided.
                </p>
                <p className="map-placeholder-sub">
                  Do not add a location pin without a verified address.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
