import { useEffect, useRef, Suspense, lazy } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, ArrowDown, Layers, Settings, Shield, Zap } from 'lucide-react'
import './HomePage.css'

const ModelViewer = lazy(() => import('../components/3d/ModelViewer'))

// ============================================================
// Hero Section
// ============================================================
function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.play().catch(() => {
        // Autoplay blocked – fallback poster is shown
      })
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current
        if (video) {
          if (!entry.isIntersecting) {
            video.pause()
          } else {
            video.play().catch(() => {})
          }
        }
      },
      { threshold: 0.1 }
    )
    if (heroRef.current) observer.observe(heroRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="hero-section" ref={heroRef} aria-label="Hero">
      {/* Background video & overlays */}
      <div className="hero-video-wrap" aria-hidden="true">
        <video
          ref={videoRef}
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          poster="/images/cnc-machining-poster.jpg"
          preload="metadata"
        >
          <source src="/videos/cnc-machining.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay" />
        <div className="hero-tech-grid" />
        <div className="hero-gradient-bottom" />
      </div>

      {/* Content */}
      <div className="container hero-content">
        <div className="hero-eyebrow">
          <span className="hero-badge">Precision Industrial Tooling</span>
        </div>

        <h1 className="hero-title">
          <span className="hero-title-line">Precision Tooling.</span>
          <span className="hero-title-line hero-title-accent">
            Engineered for Performance.
          </span>
        </h1>

        <p className="hero-description">
          SKM Tooling Center specialises in high-precision tooling components — core inserts,
          cavity plates, moulding tools and industrial tooling solutions crafted to exacting
          engineering standards.
        </p>

        <div className="hero-cta-group">
          <Link to="/products" className="btn btn--primary btn--lg" id="hero-primary-cta">
            Explore Our Products
            <ChevronRight size={18} />
          </Link>
          <Link to="/quote" className="btn btn--secondary btn--lg" id="hero-quote-cta">
            Request a Quote
          </Link>
        </div>

        {/* Stats strip */}
        <div className="hero-stats" aria-label="Company highlights">
          {[
            { value: 'Precision', label: 'Core Inserts' },
            { value: 'Engineered', label: 'Cavity Plates' },
            { value: 'Reliable', label: 'Moulding Tools' },
            { value: 'Quality', label: 'Tooling Components' },
          ].map((stat) => (
            <div key={stat.label} className="hero-stat">
              <span className="hero-stat-value">{stat.value}</span>
              <span className="hero-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <a href="#products" className="scroll-indicator" aria-label="Scroll to products">
        <ArrowDown size={16} />
        <span>Scroll</span>
      </a>
    </section>
  )
}

// ============================================================
// Products Preview Section
// ============================================================
const PRODUCTS_PREVIEW = [
  {
    slug: 'core-inserts',
    modelKey: 'core-insert',
    name: 'Core Inserts',
    description: 'Precision-machined core inserts for injection moulding tools.',
    category: 'Core Inserts',
  },
  {
    slug: 'cavity-plates',
    modelKey: 'cavity-plate',
    name: 'Cavity Plates',
    description: 'High-precision cavity plates for consistent part quality.',
    category: 'Cavity Plates',
  },
  {
    slug: 'moulding-tools',
    modelKey: 'moulding-tool',
    name: 'Moulding Tools',
    description: 'Complete moulding tool assemblies to customer specifications.',
    category: 'Moulding Tools',
  },
]

function ProductsPreview() {
  return (
    <section id="products" className="section products-preview">
      <div className="container">
        <div className="section-header">
          <p className="section-label">Our Products</p>
          <h2 className="section-title">Precision-Engineered Components</h2>
          <p className="section-description">
            From core inserts to complete moulding tool assemblies — each component manufactured
            to precise specifications and engineering requirements.
          </p>
        </div>

        <div className="products-preview-grid">
          {PRODUCTS_PREVIEW.map((product, i) => (
            <div key={product.slug} className="product-card reveal" style={{ transitionDelay: `${i * 100}ms` }}>
              <div className="product-card-viewer">
                <Suspense
                  fallback={
                    <div className="product-card-loader">
                      <div className="spinner" />
                    </div>
                  }
                >
                  <ModelViewer
                    modelKey={product.modelKey}
                    height={260}
                    showLabel={false}
                    autoRotate
                  />
                </Suspense>
              </div>
              <div className="product-card-body">
                <span className="product-card-category">{product.category}</span>
                <h3 className="product-card-name">{product.name}</h3>
                <p className="product-card-desc">{product.description}</p>
                <div className="product-card-actions">
                  <Link to={`/products/${product.slug}`} className="btn btn--ghost btn--sm">
                    View Details
                  </Link>
                  <Link to="/quote" className="btn btn--primary btn--sm">
                    Get a Quote
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="products-preview-footer">
          <Link to="/products" className="btn btn--secondary btn--lg" id="home-all-products-btn">
            View All Products
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}

// ============================================================
// Capabilities Strip
// ============================================================
const CAPABILITIES = [
  {
    icon: <Layers size={24} />,
    title: 'Tooling Components',
    desc: 'Core inserts, cavity plates, case cover plates and specialist precision components.',
  },
  {
    icon: <Settings size={24} />,
    title: 'Moulding Tools',
    desc: 'Complete moulding tool assemblies designed and manufactured to customer drawings.',
  },
  {
    icon: <Shield size={24} />,
    title: 'Engineering Quality',
    desc: 'Rigorous drawing review and component validation for every part we produce.',
  },
  {
    icon: <Zap size={24} />,
    title: 'Industrial Focus',
    desc: 'Dedicated to demanding industrial tooling applications with exacting requirements.',
  },
]

function CapabilitiesStrip() {
  return (
    <section className="capabilities-strip section">
      <div className="container">
        <div className="section-header">
          <p className="section-label">Capabilities</p>
          <h2 className="section-title">What We Do</h2>
        </div>
        <div className="capabilities-grid">
          {CAPABILITIES.map((cap, i) => (
            <div key={cap.title} className="capability-card reveal" style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="capability-icon">{cap.icon}</div>
              <h3 className="capability-title">{cap.title}</h3>
              <p className="capability-desc">{cap.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================
// Process Section
// ============================================================
const PROCESS_STEPS = [
  { num: '01', title: 'Requirement Discussion', desc: 'Understanding your component needs, drawings, and project requirements.' },
  { num: '02', title: 'Drawing & Design Review', desc: 'Careful review of engineering drawings and technical specifications.' },
  { num: '03', title: 'Tooling Planning', desc: 'Planning the manufacturing approach to meet your specifications.' },
  { num: '04', title: 'Manufacturing', desc: 'Precision fabrication of tooling components to the agreed drawings.' },
  { num: '05', title: 'Inspection & Validation', desc: 'Component inspection and verification against specifications.' },
  { num: '06', title: 'Delivery & Coordination', desc: 'Timely delivery with clear communication throughout the process.' },
]

function ProcessSection() {
  return (
    <section className="process-section section">
      <div className="tech-grid" aria-hidden="true" />
      <div className="container">
        <div className="section-header">
          <p className="section-label">Our Process</p>
          <h2 className="section-title">How We Work</h2>
          <p className="section-description">
            A structured approach to delivering precision tooling components that meet your requirements.
            The following represents a typical tooling workflow for illustration.
          </p>
        </div>
        <div className="process-timeline">
          {PROCESS_STEPS.map((step, i) => (
            <div key={step.num} className="process-step reveal" style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="process-step-number">{step.num}</div>
              <div className="process-step-content">
                <h3 className="process-step-title">{step.title}</h3>
                <p className="process-step-desc">{step.desc}</p>
              </div>
              {i < PROCESS_STEPS.length - 1 && (
                <div className="process-step-connector" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================
// CTA Banner
// ============================================================
function CTABanner() {
  return (
    <section className="cta-banner section">
      <div className="container">
        <div className="cta-banner-inner">
          <div className="cta-banner-grid" aria-hidden="true" />
          <div className="cta-banner-content">
            <h2 className="cta-banner-title">
              Ready to Discuss Your Tooling Requirements?
            </h2>
            <p className="cta-banner-desc">
              Contact SKM Tooling Center to discuss your precision tooling needs.
              Our team is ready to review your drawings and specifications.
            </p>
            <div className="cta-banner-actions">
              <Link to="/quote" className="btn btn--primary btn--lg" id="home-cta-quote-btn">
                Request a Quote
                <ChevronRight size={18} />
              </Link>
              <Link to="/contact" className="btn btn--secondary btn--lg" id="home-cta-contact-btn">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================
// Page — HomePage
// ============================================================
export default function HomePage() {
  // Scroll-reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <title>SKM Tooling Center | Precision Industrial Tooling</title>
      <meta
        name="description"
        content="SKM Tooling Center delivers precision-engineered tooling components including core inserts, cavity plates, moulding tools, and case cover plates."
      />
      <HeroSection />
      <ProductsPreview />
      <CapabilitiesStrip />
      <ProcessSection />
      <CTABanner />
    </>
  )
}
