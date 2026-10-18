import { useEffect, useState } from 'react'
import { AdminLayout } from './AdminLayout'
import { fetchAdminProducts, updateProduct, deleteProduct } from '../../lib/api'
import toast from 'react-hot-toast'
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import './AdminPages.css'

interface Product {
  id: number
  slug: string
  name: string
  category: string
  short_description: string
  is_published: boolean
  sort_order: number
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Product | null>(null)
  const [editFields, setEditFields] = useState<Partial<Product>>({})
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    fetchAdminProducts()
      .then((r) => setProducts(r.data))
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleTogglePublish = async (p: Product) => {
    try {
      await updateProduct(p.id, { is_published: !p.is_published })
      toast.success(`Product ${p.is_published ? 'hidden' : 'published'}`)
      load()
    } catch {
      toast.error('Failed to update product')
    }
  }

  const handleDelete = async (p: Product) => {
    if (!window.confirm(`Delete product "${p.name}"? This cannot be undone.`)) return
    try {
      await deleteProduct(p.id)
      toast.success('Product deleted')
      load()
    } catch {
      toast.error('Failed to delete product')
    }
  }

  const handleEdit = (p: Product) => {
    setEditing(p)
    setEditFields({
      name: p.name,
      category: p.category,
      short_description: p.short_description,
      sort_order: p.sort_order,
    })
  }

  const handleSave = async () => {
    if (!editing) return
    setSaving(true)
    try {
      await updateProduct(editing.id, editFields)
      toast.success('Product updated')
      setEditing(null)
      load()
    } catch {
      toast.error('Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout title="Products">
      <title>Products | SKM Tooling Center Admin</title>

      <div className="admin-toolbar">
        <h2 className="admin-toolbar-title">Product Catalogue</h2>
      </div>

      {loading ? (
        <div className="spinner spinner--lg" style={{ margin: '3rem auto' }} />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Name</th>
                <th>Category</th>
                <th>Published</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>{p.sort_order}</td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent)' }}>
                      {p.category}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge--${p.is_published ? 'completed' : 'closed'}`}>
                      {p.is_published ? 'Published' : 'Hidden'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="btn btn--ghost btn--sm"
                        onClick={() => handleEdit(p)}
                        aria-label={`Edit ${p.name}`}
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        className="btn btn--ghost btn--sm"
                        onClick={() => handleTogglePublish(p)}
                        aria-label={p.is_published ? 'Hide' : 'Publish'}
                        title={p.is_published ? 'Hide' : 'Publish'}
                      >
                        {p.is_published ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button
                        className="btn btn--ghost btn--sm"
                        onClick={() => handleDelete(p)}
                        aria-label={`Delete ${p.name}`}
                        title="Delete"
                        style={{ color: 'var(--error)' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div className="admin-modal-overlay" onClick={() => setEditing(null)} role="dialog" aria-modal="true">
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>Edit: {editing.name}</h2>
              <button className="btn btn--ghost btn--sm" onClick={() => setEditing(null)}>Close</button>
            </div>
            <div className="admin-modal-body">
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input
                  className="form-input"
                  value={editFields.name || ''}
                  onChange={(e) => setEditFields({ ...editFields, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <input
                  className="form-input"
                  value={editFields.category || ''}
                  onChange={(e) => setEditFields({ ...editFields, category: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Short Description</label>
                <textarea
                  className="form-textarea"
                  value={editFields.short_description || ''}
                  onChange={(e) => setEditFields({ ...editFields, short_description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Sort Order</label>
                <input
                  className="form-input"
                  type="number"
                  value={editFields.sort_order ?? 0}
                  onChange={(e) => setEditFields({ ...editFields, sort_order: parseInt(e.target.value) })}
                />
              </div>
              <button className="btn btn--primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
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
          border-radius: var(--radius-2xl); width: 100%; max-width: 520px;
          max-height: 85vh; overflow-y: auto;
        }
        .admin-modal-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border);
        }
        .admin-modal-header h2 { font-size: 1.125rem; font-weight: 700; }
        .admin-modal-body {
          padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;
        }
      `}</style>
    </AdminLayout>
  )
}
