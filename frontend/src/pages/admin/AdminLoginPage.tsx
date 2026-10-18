import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminLogin } from '../../lib/api'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Loader } from 'lucide-react'
import './AdminPages.css'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      toast.error('Please enter username and password')
      return
    }
    setLoading(true)
    try {
      const res = await adminLogin(username, password)
      localStorage.setItem('skm_admin_token', res.data.access_token)
      localStorage.setItem('skm_admin_user', JSON.stringify({
        username: res.data.username,
        role: res.data.role,
      }))
      toast.success(`Welcome, ${res.data.username}`)
      navigate('/admin/dashboard')
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Login failed. Please check your credentials.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-page">
      <div className="tech-grid" aria-hidden="true" />
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="6" fill="#4A9EFF" fillOpacity="0.1" />
            <rect x="1" y="1" width="30" height="30" rx="5" stroke="#4A9EFF" strokeOpacity="0.4" strokeWidth="1" />
            <path d="M8 12h4l2 4 2-4h4" stroke="#4A9EFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="16" cy="12" r="2" fill="#4A9EFF" fillOpacity="0.8"/>
          </svg>
          <div>
            <p className="admin-brand-name">SKM Tooling Center</p>
            <p className="admin-brand-sub">Admin Portal</p>
          </div>
        </div>

        <h1 className="admin-login-title">Sign In</h1>
        <p className="admin-login-desc">Enter your admin credentials to access the dashboard.</p>

        <form onSubmit={handleSubmit} noValidate aria-label="Admin login form">
          <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
            <label htmlFor="admin-username" className="form-label">
              Username or Email
            </label>
            <input
              id="admin-username"
              type="text"
              className="form-input"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 'var(--space-6)' }}>
            <label htmlFor="admin-password" className="form-label">Password</label>
            <div className="password-wrap">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn--primary w-full"
            id="admin-login-btn"
            disabled={loading}
          >
            {loading ? <><Loader size={16} className="spinner-inline" /> Signing in...</> : 'Sign In'}
          </button>
        </form>

        <p className="admin-back-link">
          ← <a href="/">Back to Website</a>
        </p>
      </div>
    </div>
  )
}
