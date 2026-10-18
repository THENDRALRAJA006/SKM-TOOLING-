import { ReactNode, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  MessageSquare,
  Package,
  Settings,
  LogOut,
  ExternalLink,
} from 'lucide-react'

const NAV = [
  { to: '/admin/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { to: '/admin/enquiries', icon: <MessageSquare size={18} />, label: 'Enquiries' },
  { to: '/admin/products', icon: <Package size={18} />, label: 'Products' },
  { to: '/admin/settings', icon: <Settings size={18} />, label: 'Settings' },
]

export function AdminLayout({ children, title }: { children: ReactNode; title: string }) {
  const navigate = useNavigate()
  const location = useLocation()
  const userStr = localStorage.getItem('skm_admin_user')
  const user = userStr ? JSON.parse(userStr) : null

  useEffect(() => {
    const token = localStorage.getItem('skm_admin_token')
    if (!token) navigate('/admin', { replace: true })
  }, [navigate])

  const logout = () => {
    localStorage.removeItem('skm_admin_token')
    localStorage.removeItem('skm_admin_user')
    navigate('/admin')
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="6" fill="#4A9EFF" fillOpacity="0.1" />
            <rect x="1" y="1" width="30" height="30" rx="5" stroke="#4A9EFF" strokeOpacity="0.4" strokeWidth="1" />
            <path d="M8 12h4l2 4 2-4h4" stroke="#4A9EFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="16" cy="12" r="2" fill="#4A9EFF" fillOpacity="0.8"/>
          </svg>
          <div>
            <p className="admin-sidebar-brand-name">SKM Tooling Center</p>
            <p className="admin-sidebar-brand-sub">Admin</p>
          </div>
        </div>

        <nav className="admin-nav" aria-label="Admin navigation">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`admin-nav-link${location.pathname === item.to ? ' active' : ''}`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <a href="/" target="_blank" rel="noopener noreferrer" className="admin-nav-link">
            <ExternalLink size={18} />
            View Website
          </a>
          <button className="admin-nav-link admin-logout-btn" onClick={logout}>
            <LogOut size={18} />
            Sign Out
          </button>
          {user && (
            <div className="admin-user-chip">
              <div className="admin-user-avatar">
                {user.username?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="admin-user-name">{user.username}</p>
                <p className="admin-user-role">{user.role}</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <div className="admin-page-header">
          <h1 className="admin-page-title">{title}</h1>
        </div>
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  )
}
