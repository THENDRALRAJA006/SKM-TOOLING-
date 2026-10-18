import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, ChevronRight, Clock, ExternalLink } from 'lucide-react'
import { SITE_CONTACT } from '../config/contact'
import './ContactPage.css'

export default function ContactPage() {
  return (
    <>
      <title>Contact Us | {SITE_CONTACT.companyName}</title>
      <meta
        name="description"
        content={`Contact ${SITE_CONTACT.companyName} at ${SITE_CONTACT.primaryPhone} or ${SITE_CONTACT.email} for precision tooling components, core inserts, cavity plates, and industrial manufacturing.`}
      />

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
              Connect directly with our engineering team for precision tooling inquiries, component quotes, and technical specifications.
            </p>
          </div>
        </div>

        <div className="container" style={{ paddingBlock: 'var(--space-16)' }}>
          <div className="contact-layout">
            {/* Info column */}
            <div className="contact-info">
              <div className="contact-header-block">
                <h2 className="contact-info-title">Official Contact Details</h2>
                <p className="contact-info-desc">
                  Reach out to {SITE_CONTACT.companyName} via phone, WhatsApp, or email, or submit an online RFQ.
                </p>
              </div>

              {/* Direct WhatsApp Callout Banner */}
              <div className="whatsapp-banner">
                <div className="whatsapp-banner-content">
                  <span className="whatsapp-banner-badge">Instant Support</span>
                  <h3 className="whatsapp-banner-title">Enquire on WhatsApp</h3>
                  <p className="whatsapp-banner-text">
                    Send engineering drawings, photos, or tooling questions directly to our team.
                  </p>
                  <a
                    href={SITE_CONTACT.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn whatsapp-btn"
                    id="contact-whatsapp-cta"
                  >
                    <svg className="whatsapp-svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                    Chat on WhatsApp: {SITE_CONTACT.whatsappNumber}
                    <ExternalLink size={15} />
                  </a>
                </div>
              </div>

              <div className="contact-details">
                {/* Primary Phone */}
                <div className="contact-detail-item">
                  <div className="contact-detail-icon">
                    <Phone size={20} />
                  </div>
                  <div className="contact-detail-content">
                    <span className="contact-detail-label">Primary Telephone</span>
                    <a
                      href={SITE_CONTACT.primaryPhoneTel}
                      className="contact-detail-link"
                      id="contact-primary-phone"
                    >
                      {SITE_CONTACT.primaryPhone}
                    </a>
                    <span className="contact-detail-hint">Direct engineering & sales line</span>
                  </div>
                </div>

                {/* Secondary Phone */}
                <div className="contact-detail-item">
                  <div className="contact-detail-icon">
                    <Phone size={20} />
                  </div>
                  <div className="contact-detail-content">
                    <span className="contact-detail-label">Secondary Telephone (Additional Option)</span>
                    <a
                      href={SITE_CONTACT.secondaryPhoneTel}
                      className="contact-detail-link"
                      id="contact-secondary-phone"
                    >
                      {SITE_CONTACT.secondaryPhone}
                    </a>
                    <span className="contact-detail-hint">Alternative workshop contact</span>
                  </div>
                </div>

                {/* Official Email */}
                <div className="contact-detail-item">
                  <div className="contact-detail-icon">
                    <Mail size={20} />
                  </div>
                  <div className="contact-detail-content">
                    <span className="contact-detail-label">Official Email Address</span>
                    <a
                      href={SITE_CONTACT.emailMailto}
                      className="contact-detail-link"
                      id="contact-email"
                    >
                      {SITE_CONTACT.email}
                    </a>
                    <span className="contact-detail-hint">Quotations, RFQs & general correspondence</span>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="contact-detail-item">
                  <div className="contact-detail-icon">
                    <Clock size={20} />
                  </div>
                  <div className="contact-detail-content">
                    <span className="contact-detail-label">Operating Hours</span>
                    <span className="contact-detail-value">{SITE_CONTACT.operatingHours}</span>
                    <span className="contact-detail-hint">Sunday: Closed</span>
                  </div>
                </div>
              </div>

              <div className="contact-quote-promo">
                <h3 className="contact-quote-promo-title">Have a Specific Project in Mind?</h3>
                <p>Submit a formal RFQ with technical drawings, tolerances, and CAD files for a comprehensive quotation.</p>
                <Link to="/quote" className="btn btn--primary" id="contact-quote-btn">
                  Request a Formal Quote
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>

            {/* Right column: Facility Address & Maps Integration */}
            <div className="contact-location-card">
              <div className="location-card-header">
                <div className="location-icon-wrap">
                  <MapPin size={24} />
                </div>
                <div>
                  <span className="location-label">Facility & Works Location</span>
                  <h3 className="location-title">{SITE_CONTACT.companyName}</h3>
                </div>
              </div>

              <div className="location-address-box">
                <p className="address-line address-main">{SITE_CONTACT.address.line1}</p>
                <p className="address-line">{SITE_CONTACT.address.line2}</p>
                <p className="address-line">{SITE_CONTACT.address.industrialArea}</p>
                <p className="address-line address-highlight">
                  {SITE_CONTACT.address.city} – {SITE_CONTACT.address.pincode}
                </p>
                <p className="address-line">
                  {SITE_CONTACT.address.district}, {SITE_CONTACT.address.state}, {SITE_CONTACT.address.country}
                </p>
              </div>

              <div className="location-map-action">
                <p className="location-map-note">
                  Search and navigate to the official facility address using Google Maps:
                </p>
                <a
                  href={SITE_CONTACT.mapsSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--secondary location-map-btn"
                  id="contact-google-maps-btn"
                >
                  <MapPin size={16} />
                  View Address on Google Maps
                  <ExternalLink size={14} />
                </a>
              </div>

              <div className="location-highlights">
                <div className="location-highlight-item">
                  <span className="highlight-tag">Industrial Hub</span>
                  <p>Located in the heart of SIPCOT Phase 3 industrial corridor in Hosur.</p>
                </div>
                <div className="location-highlight-item">
                  <span className="highlight-tag">Precision Facility</span>
                  <p>Equipped for high-precision machining, tool assembly, and component inspection.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
