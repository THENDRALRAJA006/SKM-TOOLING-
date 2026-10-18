export default function PrivacyPage() {
  return (
    <>
      <title>Privacy Policy | SKM Tooling Center</title>
      <div style={{ paddingTop: 'var(--header-height)', minHeight: '100vh' }}>
        <div className="container section">
          <div className="section-label">Legal</div>
          <h1 className="section-title" style={{ marginBottom: 'var(--space-8)' }}>
            Privacy Policy
          </h1>
          <div className="privacy-content">
            <p><strong>Effective date:</strong> {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <h2>1. Introduction</h2>
            <p>
              This Privacy Policy explains how SKM Tooling Center (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) collects, uses,
              and protects the personal information you provide when using our website and submitting enquiries.
            </p>

            <h2>2. Information We Collect</h2>
            <p>When you submit a quotation enquiry or contact form, we collect:</p>
            <ul>
              <li>Your name and company name</li>
              <li>Your email address and telephone number</li>
              <li>Project description, requirements, and uploaded files</li>
              <li>Technical and browser information for security purposes</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use the information you provide to:</p>
            <ul>
              <li>Respond to your enquiry or quotation request</li>
              <li>Communicate about your tooling project</li>
              <li>Maintain secure records of business enquiries</li>
            </ul>
            <p>
              We do not sell, share, or disclose your personal information to third parties for
              marketing purposes.
            </p>

            <h2>4. Data Retention</h2>
            <p>
              Enquiry data is retained for the purposes of managing our business communications.
              You may contact us to request deletion of your personal information.
            </p>

            <h2>5. Uploaded Files</h2>
            <p>
              Files uploaded with your enquiry (such as drawings or specifications) are stored
              securely and are only accessible to authorised SKM Tooling Center staff. Uploaded
              files are not published publicly.
            </p>

            <h2>6. Cookies</h2>
            <p>
              This website does not currently use tracking or advertising cookies. Essential
              functionality may use session storage only.
            </p>

            <h2>7. Contact</h2>
            <p>
              For any data-related requests or questions about this policy, please use the
              contact form on our website.
            </p>

            <p style={{ marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-faint)' }}>
              This privacy policy describes the actual data collection implemented in this website.
              It does not constitute legal compliance advice. You should review this policy with
              appropriate legal counsel before going live.
            </p>
          </div>
        </div>
      </div>
      <style>{`
        .privacy-content h2 {
          font-size: 1.25rem;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          color: var(--text-primary);
        }
        .privacy-content p, .privacy-content ul {
          font-size: 0.9375rem;
          color: var(--text-secondary);
          line-height: 1.7;
          margin-bottom: 0.75rem;
        }
        .privacy-content ul {
          padding-left: 1.5rem;
        }
        .privacy-content ul li {
          margin-bottom: 0.375rem;
        }
      `}</style>
    </>
  )
}
