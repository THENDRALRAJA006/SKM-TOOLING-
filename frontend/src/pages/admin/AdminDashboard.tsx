import { useEffect, useState } from 'react'
import { AdminLayout } from './AdminLayout'
import { fetchDashboard } from '../../lib/api'
import { Link } from 'react-router-dom'
import './AdminPages.css'

interface Stats {
  total_enquiries: number
  new_enquiries: number
  in_progress_enquiries: number
  completed_enquiries: number
  closed_enquiries: number
  total_products: number
  published_products: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboard()
      .then((r) => setStats(r.data))
      .catch(() => setError('Failed to load dashboard data.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <AdminLayout title="Dashboard">
      <title>Dashboard | SKM Tooling Center Admin</title>

      {loading && <div className="spinner spinner--lg" style={{ margin: '3rem auto' }} />}
      {error && <p style={{ color: 'var(--error)' }}>{error}</p>}

      {stats && (
        <>
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <span className="admin-stat-value">{stats.total_enquiries}</span>
              <span className="admin-stat-label">Total Enquiries</span>
            </div>
            <div className="admin-stat-card admin-stat-new">
              <span className="admin-stat-value">{stats.new_enquiries}</span>
              <span className="admin-stat-label">New</span>
            </div>
            <div className="admin-stat-card admin-stat-in-progress">
              <span className="admin-stat-value">{stats.in_progress_enquiries}</span>
              <span className="admin-stat-label">In Progress</span>
            </div>
            <div className="admin-stat-card admin-stat-completed">
              <span className="admin-stat-value">{stats.completed_enquiries}</span>
              <span className="admin-stat-label">Completed</span>
            </div>
          </div>

          <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <div className="admin-stat-card">
              <span className="admin-stat-value">{stats.total_products}</span>
              <span className="admin-stat-label">Total Products</span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-value">{stats.published_products}</span>
              <span className="admin-stat-label">Published Products</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', marginTop: 'var(--space-4)' }}>
            <Link to="/admin/enquiries" className="btn btn--primary">Manage Enquiries</Link>
            <Link to="/admin/products" className="btn btn--secondary">Manage Products</Link>
            <Link to="/admin/settings" className="btn btn--ghost">Site Settings</Link>
          </div>
        </>
      )}
    </AdminLayout>
  )
}
