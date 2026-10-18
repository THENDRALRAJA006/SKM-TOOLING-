import { useEffect, useState } from 'react'
import { AdminLayout } from './AdminLayout'
import { fetchAdminEnquiries, updateEnquiryStatus } from '../../lib/api'
import toast from 'react-hot-toast'
import './AdminPages.css'

interface Enquiry {
  id: number
  reference: string
  name: string
  email: string
  company: string
  product_category: string
  description: string
  status: string
  admin_notes: string
  created_at: string
}

const STATUS_LABELS: Record<string, string> = {
  new: 'New',
  in_progress: 'In Progress',
  completed: 'Completed',
  closed: 'Closed',
}

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selected, setSelected] = useState<Enquiry | null>(null)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [notes, setNotes] = useState('')

  const load = () => {
    setLoading(true)
    fetchAdminEnquiries({ status: statusFilter || undefined, search: search || undefined })
      .then((r) => setEnquiries(r.data))
      .catch(() => toast.error('Failed to load enquiries'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [statusFilter])

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); load() }

  const handleStatusChange = async (id: number, status: string, adminNotes?: string) => {
    setUpdatingId(id)
    try {
      await updateEnquiryStatus(id, status, adminNotes)
      toast.success('Status updated')
      load()
      setSelected(null)
    } catch {
      toast.error('Failed to update status')
    } finally {
      setUpdatingId(null)
    }
  }

  const formatDate = (dt: string) =>
    new Date(dt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <AdminLayout title="Enquiries">
      <title>Enquiries | SKM Tooling Center Admin</title>

      <div className="admin-toolbar">
        <h2 className="admin-toolbar-title">All Enquiries</h2>
        <select
          className="form-select"
          style={{ width: 'auto' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="">All Statuses</option>
          {Object.entries(STATUS_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="search"
            className="form-input"
            placeholder="Search name, email, ref..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '200px' }}
            aria-label="Search enquiries"
          />
          <button type="submit" className="btn btn--secondary btn--sm">Search</button>
        </form>
      </div>

      {loading ? (
        <div className="spinner spinner--lg" style={{ margin: '3rem auto' }} />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Name</th>
                <th>Email</th>
                <th>Category</th>
                <th>Status</th>
                <th>Received</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-faint)' }}>
                    No enquiries found
                  </td>
                </tr>
              ) : (
                enquiries.map((enq) => (
                  <tr key={enq.id}>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--accent)' }}>
                        {enq.reference}
                      </span>
                    </td>
                    <td>{enq.name}</td>
                    <td style={{ fontSize: '0.875rem' }}>{enq.email}</td>
                    <td style={{ fontSize: '0.875rem' }}>{enq.product_category || '–'}</td>
                    <td>
                      <span className={`badge badge--${enq.status.replace('_', '-')}`}>
                        {STATUS_LABELS[enq.status] || enq.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8125rem' }}>{formatDate(enq.created_at)}</td>
                    <td>
                      <button
                        className="btn btn--ghost btn--sm"
                        onClick={() => { setSelected(enq); setNotes(enq.admin_notes) }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div className="admin-modal-overlay" onClick={() => setSelected(null)} role="dialog" aria-modal="true" aria-label="Enquiry details">
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>Enquiry {selected.reference}</h2>
              <button className="btn btn--ghost btn--sm" onClick={() => setSelected(null)}>Close</button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-modal-field"><strong>Name:</strong> {selected.name}</div>
              <div className="admin-modal-field"><strong>Company:</strong> {selected.company || '–'}</div>
              <div className="admin-modal-field"><strong>Email:</strong> <a href={`mailto:${selected.email}`}>{selected.email}</a></div>
              <div className="admin-modal-field"><strong>Category:</strong> {selected.product_category || '–'}</div>
              <div className="admin-modal-field"><strong>Status:</strong>
                <select
                  className="form-select"
                  style={{ width: 'auto', marginLeft: '0.5rem' }}
                  defaultValue={selected.status}
                  id={`status-select-${selected.id}`}
                >
                  {Object.entries(STATUS_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
              <div className="admin-modal-field">
                <strong>Description:</strong>
                <p style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap' }}>{selected.description}</p>
              </div>
              <div className="admin-modal-field">
                <label htmlFor="admin-notes" style={{ fontWeight: 600 }}>Admin Notes:</label>
                <textarea
                  id="admin-notes"
                  className="form-textarea"
                  style={{ marginTop: '0.5rem' }}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
              <button
                className="btn btn--primary"
                disabled={updatingId === selected.id}
                onClick={() => {
                  const el = document.getElementById(`status-select-${selected.id}`) as HTMLSelectElement
                  handleStatusChange(selected.id, el.value, notes)
                }}
              >
                {updatingId === selected.id ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.7);
          display: flex; align-items: center; justify-content: center;
          z-index: var(--z-modal); padding: 1rem;
        }
        .admin-modal {
          background: var(--bg-surface); border: 1px solid var(--border);
          border-radius: var(--radius-2xl); width: 100%; max-width: 560px;
          max-height: 80vh; overflow-y: auto;
        }
        .admin-modal-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border);
        }
        .admin-modal-header h2 { font-size: 1.125rem; font-weight: 700; }
        .admin-modal-body {
          padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;
        }
        .admin-modal-field { font-size: 0.9rem; color: var(--text-secondary); }
        .admin-modal-field strong { color: var(--text-primary); }
      `}</style>
    </AdminLayout>
  )
}
