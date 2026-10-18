import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'

const Header = lazy(() => import('./components/layout/Header'))
const Footer = lazy(() => import('./components/layout/Footer'))
const HomePage = lazy(() => import('./pages/HomePage'))
const ProductsPage = lazy(() => import('./pages/ProductsPage'))
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const QuotePage = lazy(() => import('./pages/QuotePage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminEnquiries = lazy(() => import('./pages/admin/AdminEnquiries'))
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function PageLoader() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      flexDirection: 'column',
      gap: '1rem',
    }}>
      <div className="spinner spinner--lg" />
      <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
        Loading...
      </p>
    </div>
  )
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      <main style={{ flex: 1 }}>{children}</main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  )
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
          },
          success: {
            iconTheme: { primary: 'var(--success)', secondary: 'var(--bg-elevated)' },
          },
          error: {
            iconTheme: { primary: 'var(--error)', secondary: 'var(--bg-elevated)' },
          },
        }}
      />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
          <Route path="/products" element={<PublicLayout><ProductsPage /></PublicLayout>} />
          <Route path="/products/:slug" element={<PublicLayout><ProductDetailPage /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
          <Route path="/quote" element={<PublicLayout><QuotePage /></PublicLayout>} />
          <Route path="/privacy" element={<PublicLayout><PrivacyPage /></PublicLayout>} />
          {/* Admin routes */}
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/enquiries" element={<AdminEnquiries />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
