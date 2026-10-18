import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { submitEnquiry } from '../lib/api'
import toast from 'react-hot-toast'
import { CheckCircle, Upload, X, Loader } from 'lucide-react'
import './QuotePage.css'

const CATEGORIES = [
  'Core Inserts',
  'Cavity Plates',
  'Moulding Tools',
  'Case Cover Plates',
  'Tooling Components',
  'Other / General Enquiry',
]

const MAX_FILE_MB = 10
const ALLOWED_EXTS = ['.pdf', '.doc', '.docx', '.dwg', '.dxf', '.stp', '.step', '.jpg', '.jpeg', '.png']

interface FormState {
  name: string
  company: string
  email: string
  phone: string
  product_category: string
  description: string
  quantity: string
  material_spec: string
  required_delivery: string
  consent: boolean
}

interface FormErrors {
  [key: string]: string
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {}
  if (!form.name.trim()) errors.name = 'Name is required'
  if (!form.email.trim()) errors.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address'
  if (!form.description.trim()) errors.description = 'Please describe your project'
  if (!form.consent) errors.consent = 'You must agree to proceed'
  return errors
}

export default function QuotePage() {
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState<FormState>({
    name: '',
    company: '',
    email: '',
    phone: '',
    product_category: searchParams.get('product') || '',
    description: '',
    quantity: '',
    material_spec: '',
    required_delivery: '',
    consent: false,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [enquiryRef, setEnquiryRef] = useState('')

  const handleChange = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = e.target.type === 'checkbox'
      ? (e.target as HTMLInputElement).checked
      : e.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => { const next = { ...prev }; delete next[field]; return next })
    }
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null
    setFileError('')
    if (!selected) { setFile(null); return }

    const ext = '.' + selected.name.split('.').pop()?.toLowerCase()
    if (!ALLOWED_EXTS.includes(ext)) {
      setFileError(`File type not allowed. Accepted: ${ALLOWED_EXTS.join(', ')}`)
      setFile(null)
      return
    }
    if (selected.size > MAX_FILE_MB * 1024 * 1024) {
      setFileError(`File exceeds ${MAX_FILE_MB} MB limit`)
      setFile(null)
      return
    }
    setFile(selected)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validation = validate(form)
    if (Object.keys(validation).length > 0) {
      setErrors(validation)
      const firstError = document.querySelector('.form-error')
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setLoading(true)
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)))
    if (file) fd.append('attachment', file)

    try {
      const res = await submitEnquiry(fd)
      setEnquiryRef(res.data.reference)
      setSubmitted(true)
      toast.success('Enquiry submitted successfully!')
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Submission failed. Please try again.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="quote-page">
        <div className="container">
          <div className="quote-success">
            <CheckCircle size={64} className="success-icon" />
            <h1 className="success-title">Enquiry Received</h1>
            <p className="success-desc">
              Thank you for your enquiry. We have received your request and will be in touch shortly.
            </p>
            <div className="success-ref">
              <span>Your reference number:</span>
              <strong>{enquiryRef}</strong>
            </div>
            <p className="success-note">
              Please quote this reference in any future correspondence regarding this enquiry.
            </p>
            <button
              className="btn btn--primary btn--lg"
              onClick={() => { setSubmitted(false); setForm({ name: '', company: '', email: '', phone: '', product_category: '', description: '', quantity: '', material_spec: '', required_delivery: '', consent: false }) }}
            >
              Submit Another Enquiry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <title>Request a Quote | SKM Tooling Center</title>
      <meta name="description" content="Submit a quotation request to SKM Tooling Center for precision tooling components." />

      <div className="quote-page">
        {/* Page hero */}
        <div className="page-hero">
          <div className="tech-grid" aria-hidden="true" />
          <div className="container page-hero-content">
            <p className="section-label">Quotation Request</p>
            <h1 className="section-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Request a Quote
            </h1>
            <p className="section-description mx-auto" style={{ textAlign: 'center' }}>
              Complete the form below and our team will review your requirements.
            </p>
          </div>
        </div>

        <div className="container" style={{ paddingBlock: 'var(--space-16)' }}>
          <div className="quote-layout">
            {/* Form */}
            <form
              className="quote-form"
              onSubmit={handleSubmit}
              noValidate
              aria-label="Quotation request form"
            >
              <div className="form-section-title">Contact Information</div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="q-name" className="form-label form-label--required">
                    Full Name
                  </label>
                  <input
                    id="q-name"
                    type="text"
                    className={`form-input${errors.name ? ' error' : ''}`}
                    placeholder="Your full name"
                    value={form.name}
                    onChange={handleChange('name')}
                    autoComplete="name"
                    required
                  />
                  {errors.name && <p className="form-error" role="alert">{errors.name}</p>}
                </div>
                <div className="form-group">
                  <label htmlFor="q-company" className="form-label">Company</label>
                  <input
                    id="q-company"
                    type="text"
                    className="form-input"
                    placeholder="Company name (optional)"
                    value={form.company}
                    onChange={handleChange('company')}
                    autoComplete="organization"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="q-email" className="form-label form-label--required">
                    Business Email
                  </label>
                  <input
                    id="q-email"
                    type="email"
                    className={`form-input${errors.email ? ' error' : ''}`}
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={handleChange('email')}
                    autoComplete="email"
                    required
                  />
                  {errors.email && <p className="form-error" role="alert">{errors.email}</p>}
                </div>
                <div className="form-group">
                  <label htmlFor="q-phone" className="form-label">Telephone</label>
                  <input
                    id="q-phone"
                    type="tel"
                    className="form-input"
                    placeholder="+44 (0)... (optional)"
                    value={form.phone}
                    onChange={handleChange('phone')}
                    autoComplete="tel"
                  />
                </div>
              </div>

              <div className="form-section-title" style={{ marginTop: 'var(--space-6)' }}>
                Project Details
              </div>

              <div className="form-group">
                <label htmlFor="q-category" className="form-label">
                  Product / Component Category
                </label>
                <select
                  id="q-category"
                  className="form-select"
                  value={form.product_category}
                  onChange={handleChange('product_category')}
                >
                  <option value="">Select a category (optional)</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="q-desc" className="form-label form-label--required">
                  Project Description
                </label>
                <textarea
                  id="q-desc"
                  className={`form-textarea${errors.description ? ' error' : ''}`}
                  placeholder="Describe your tooling requirements, component details, or project context..."
                  value={form.description}
                  onChange={handleChange('description')}
                  rows={5}
                  required
                />
                {errors.description && (
                  <p className="form-error" role="alert">{errors.description}</p>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="q-qty" className="form-label">Required Quantity</label>
                  <input
                    id="q-qty"
                    type="text"
                    className="form-input"
                    placeholder="e.g. 50 units (optional)"
                    value={form.quantity}
                    onChange={handleChange('quantity')}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="q-delivery" className="form-label">Required Delivery Date</label>
                  <input
                    id="q-delivery"
                    type="text"
                    className="form-input"
                    placeholder="e.g. 8 weeks (optional)"
                    value={form.required_delivery}
                    onChange={handleChange('required_delivery')}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="q-material" className="form-label">Material / Specification Notes</label>
                <input
                  id="q-material"
                  type="text"
                  className="form-input"
                  placeholder="Material grade, surface finish, or other spec notes (optional)"
                  value={form.material_spec}
                  onChange={handleChange('material_spec')}
                />
              </div>

              {/* File upload */}
              <div className="form-group">
                <label className="form-label">Drawing or Reference File (Optional)</label>
                <div className={`file-upload-area${file ? ' has-file' : ''}`}>
                  {file ? (
                    <div className="file-selected">
                      <Upload size={16} />
                      <span>{file.name}</span>
                      <button
                        type="button"
                        className="file-remove-btn"
                        onClick={() => setFile(null)}
                        aria-label="Remove file"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label htmlFor="q-file" className="file-upload-label">
                      <Upload size={20} />
                      <span>Upload drawing or reference file</span>
                      <span className="file-upload-hint">
                        PDF, DWG, DXF, STEP, DOC, JPG, PNG — max {MAX_FILE_MB} MB
                      </span>
                    </label>
                  )}
                  <input
                    id="q-file"
                    type="file"
                    className="sr-only"
                    accept={ALLOWED_EXTS.join(',')}
                    onChange={handleFile}
                    aria-describedby="file-hint"
                  />
                </div>
                {fileError && <p className="form-error" role="alert">{fileError}</p>}
                <p id="file-hint" className="form-hint">
                  Do not upload confidential proprietary designs without appropriate authorisation.
                </p>
              </div>

              {/* Consent */}
              <div className="form-checkbox">
                <input
                  type="checkbox"
                  id="q-consent"
                  checked={form.consent}
                  onChange={handleChange('consent')}
                  aria-required="true"
                />
                <label htmlFor="q-consent">
                  I agree that SKM Tooling Center may use the information provided to respond to
                  this enquiry. I have read the{' '}
                  <a href="/privacy" target="_blank" rel="noopener noreferrer">
                    Privacy Policy
                  </a>.
                </label>
              </div>
              {errors.consent && (
                <p className="form-error" role="alert">{errors.consent}</p>
              )}

              <button
                type="submit"
                className="btn btn--primary btn--lg w-full"
                id="quote-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader size={18} className="spinner-inline" />
                    Submitting...
                  </>
                ) : (
                  'Submit Enquiry'
                )}
              </button>

              <p className="form-disclaimer">
                Your enquiry will be securely stored and reviewed by our team.
                We will not share your information with third parties.
              </p>
            </form>

            {/* Sidebar info */}
            <aside className="quote-sidebar">
              <div className="quote-sidebar-card">
                <h2 className="quote-sidebar-title">What Happens Next?</h2>
                <ol className="quote-steps">
                  <li className="quote-step">
                    <span className="quote-step-num">01</span>
                    <div>
                      <strong>We review your enquiry</strong>
                      <p>Our team carefully reads your requirements and drawing details.</p>
                    </div>
                  </li>
                  <li className="quote-step">
                    <span className="quote-step-num">02</span>
                    <div>
                      <strong>We contact you</strong>
                      <p>We will reach out to discuss your requirements in more detail.</p>
                    </div>
                  </li>
                  <li className="quote-step">
                    <span className="quote-step-num">03</span>
                    <div>
                      <strong>Quotation</strong>
                      <p>We prepare a quotation based on your specifications and drawings.</p>
                    </div>
                  </li>
                </ol>
              </div>

              <div className="quote-sidebar-card">
                <h3 className="quote-sidebar-tip-title">Helpful Tips</h3>
                <ul className="quote-tips">
                  <li>Include engineering drawings where available</li>
                  <li>Specify required tolerances if critical</li>
                  <li>Indicate required quantities</li>
                  <li>Note any delivery deadlines</li>
                  <li>Describe the application or end-use</li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}
