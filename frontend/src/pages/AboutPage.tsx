import './AboutPage.css'
import { Link } from 'react-router-dom'
import { ChevronRight, Target, Eye, Award, Users } from 'lucide-react'
import { useEffect } from 'react'

const COMPANY_INFO_NEEDED = [
  'Founding year and company history',
  'Registered address and location',
  'Contact telephone number and email',
  'Team size and key personnel',
  'Specific machinery and equipment',
  'Certifications and accreditations',
  'Production capabilities and capacity',
  'Verified client references (with consent)',
]

const VALUES = [
  {
    icon: <Target size={22} />,
    title: 'Precision',
    desc: 'Every component we produce is held to strict dimensional and quality requirements.',
  },
  {
    icon: <Eye size={22} />,
    title: 'Detail-Oriented',
    desc: 'Thorough drawing review and engineering discussion are central to how we work.',
  },
  {
    icon: <Award size={22} />,
    title: 'Reliability',
    desc: 'Consistent delivery of tooling components that meet agreed specifications.',
  },
  {
    icon: <Users size={22} />,
    title: 'Collaboration',
    desc: 'Working closely with our customers throughout the tooling process.',
  },
]

export default function AboutPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in-view')),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <title>About | SKM Tooling Center</title>
      <meta name="description" content="Learn about SKM Tooling Center — precision tooling specialists focused on core inserts, cavity plates, and moulding tools." />

      <div className="about-page">
        {/* Page Hero */}
        <div className="page-hero">
          <div className="tech-grid" aria-hidden="true" />
          <div className="container page-hero-content">
            <p className="section-label">About Us</p>
            <h1 className="section-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              SKM Tooling Center
            </h1>
            <p className="section-description mx-auto" style={{ textAlign: 'center' }}>
              Precision tooling specialists serving demanding industrial applications.
            </p>
          </div>
        </div>

        {/* Company overview */}
        <section className="section about-overview">
          <div className="container">
            <div className="about-grid">
              <div className="about-text reveal">
                <p className="section-label">Who We Are</p>
                <h2 className="section-title">Industrial Tooling, Engineered Precisely</h2>
                <p className="about-description">
                  SKM Tooling Center specialises in the manufacture of precision tooling components
                  for industrial applications. Our focus is on delivering core inserts, cavity
                  plates, moulding tools, case cover plates, and other specialist tooling components
                  that meet the exacting requirements of our customers.
                </p>
                <p className="about-description">
                  We work directly from engineering drawings and specifications, applying careful
                  technical review to every project. Our approach prioritises accuracy, reliability,
                  and clear communication throughout the tooling process.
                </p>
                <Link to="/contact" className="btn btn--primary mt-6" id="about-contact-btn">
                  Get in Touch
                  <ChevronRight size={16} />
                </Link>
              </div>

              <div className="about-placeholder reveal reveal-delay-2">
                <div className="about-visual-card">
                  <div className="about-visual-grid" aria-hidden="true" />
                  <div className="about-visual-content">
                    <div className="about-precision-mark">
                      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                        <circle cx="32" cy="32" r="30" stroke="#4A9EFF" strokeOpacity="0.3" strokeWidth="1" />
                        <circle cx="32" cy="32" r="20" stroke="#4A9EFF" strokeOpacity="0.5" strokeWidth="1" />
                        <circle cx="32" cy="32" r="10" stroke="#4A9EFF" strokeWidth="1.5" />
                        <circle cx="32" cy="32" r="3" fill="#4A9EFF" />
                        <line x1="32" y1="2" x2="32" y2="12" stroke="#4A9EFF" strokeOpacity="0.6" strokeWidth="1" />
                        <line x1="32" y1="52" x2="32" y2="62" stroke="#4A9EFF" strokeOpacity="0.6" strokeWidth="1" />
                        <line x1="2" y1="32" x2="12" y2="32" stroke="#4A9EFF" strokeOpacity="0.6" strokeWidth="1" />
                        <line x1="52" y1="32" x2="62" y2="32" stroke="#4A9EFF" strokeOpacity="0.6" strokeWidth="1" />
                      </svg>
                    </div>
                    <h3 className="about-visual-title">Precision Engineering</h3>
                    <p className="about-visual-sub">Tooling components manufactured to specification</p>
                  </div>
                </div>

                {/* Configuration notice */}
                <div className="config-notice">
                  <p className="config-notice-title">📋 Company Information Required</p>
                  <p className="config-notice-desc">
                    The following details need to be provided by SKM Tooling Center to complete this section:
                  </p>
                  <ul className="config-notice-list">
                    {COMPANY_INFO_NEEDED.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <p className="config-notice-action">
                    Log in to the admin dashboard to add verified company information.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section about-values">
          <div className="container">
            <div className="section-header reveal">
              <p className="section-label">Our Approach</p>
              <h2 className="section-title">Engineering Values</h2>
            </div>
            <div className="values-grid">
              {VALUES.map((val, i) => (
                <div key={val.title} className="value-card reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                  <div className="value-icon">{val.icon}</div>
                  <h3 className="value-title">{val.title}</h3>
                  <p className="value-desc">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section about-cta">
          <div className="container">
            <div className="cta-banner-inner">
              <div className="cta-banner-grid" />
              <div className="cta-banner-content">
                <h2 className="cta-banner-title">Discuss Your Tooling Requirements</h2>
                <p className="cta-banner-desc">
                  Ready to talk about your next tooling project? Contact us or submit a quotation request.
                </p>
                <div className="cta-banner-actions">
                  <Link to="/quote" className="btn btn--primary btn--lg" id="about-cta-quote">
                    Request a Quote <ChevronRight size={16} />
                  </Link>
                  <Link to="/contact" className="btn btn--secondary btn--lg" id="about-cta-contact">
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
