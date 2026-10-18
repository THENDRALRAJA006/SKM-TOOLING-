import { useEffect, useState } from 'react'
import { AdminLayout } from './AdminLayout'
import { fetchSettings, updateSetting } from '../../lib/api'
import toast from 'react-hot-toast'
import { Save } from 'lucide-react'
import './AdminPages.css'

interface Setting {
  key: string
  value: string
  description: string
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Setting[]>([])
  const [loading, setLoading] = useState(true)
  const [editValues, setEditValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => {
    fetchSettings()
      .then((r) => {
        setSettings(r.data)
        const vals: Record<string, string> = {}
        r.data.forEach((s: Setting) => { vals[s.key] = s.value })
        setEditValues(vals)
      })
      .catch(() => toast.error('Failed to load settings'))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (key: string) => {
    setSaving(key)
    try {
      await updateSetting(key, editValues[key] ?? '')
      toast.success('Setting saved')
    } catch {
      toast.error('Failed to save setting')
    } finally {
      setSaving(null)
    }
  }

  return (
    <AdminLayout title="Site Settings">
      <title>Settings | SKM Tooling Center Admin</title>

      <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-6)', maxWidth: '60ch', fontSize: '0.9rem' }}>
        Configure public-facing company details. Changes take effect immediately on the website.
        Only add verified business information — do not publish unconfirmed details.
      </p>

      {loading ? (
        <div className="spinner spinner--lg" style={{ margin: '3rem auto' }} />
      ) : (
        <div className="settings-grid">
          {settings.map((s) => (
            <div key={s.key} className="setting-row">
              <div className="setting-info">
                <span className="setting-key">{s.key}</span>
                <span className="setting-description">{s.description}</span>
                {s.key.includes('password') || s.key.includes('secret') ? (
                  <input
                    type="password"
                    className="form-input"
                    style={{ marginTop: '0.5rem' }}
                    value={editValues[s.key] ?? ''}
                    onChange={(e) => setEditValues({ ...editValues, [s.key]: e.target.value })}
                    aria-label={s.key}
                  />
                ) : (
                  <input
                    type="text"
                    className="form-input"
                    style={{ marginTop: '0.5rem' }}
                    value={editValues[s.key] ?? ''}
                    onChange={(e) => setEditValues({ ...editValues, [s.key]: e.target.value })}
                    placeholder={s.value ? '' : 'Not configured'}
                    aria-label={s.key}
                  />
                )}
              </div>
              <button
                className="btn btn--primary btn--sm"
                onClick={() => handleSave(s.key)}
                disabled={saving === s.key}
                aria-label={`Save ${s.key}`}
                style={{ alignSelf: 'flex-end' }}
              >
                {saving === s.key ? '...' : <Save size={14} />}
              </button>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
