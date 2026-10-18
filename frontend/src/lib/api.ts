import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

// Attach token to admin requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('skm_admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 for admin routes
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname.startsWith('/admin')) {
      localStorage.removeItem('skm_admin_token')
      localStorage.removeItem('skm_admin_user')
      window.location.href = '/admin'
    }
    return Promise.reject(error)
  }
)

export default api

// ---- Products ----
export const fetchProducts = (category?: string) =>
  api.get('/products', { params: category ? { category } : {} })

export const fetchProduct = (slug: string) => api.get(`/products/${slug}`)

// ---- Enquiries ----
export const submitEnquiry = (formData: FormData) =>
  api.post('/enquiries', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

// ---- Admin Auth ----
export const adminLogin = (username: string, password: string) => {
  const form = new URLSearchParams()
  form.append('username', username)
  form.append('password', password)
  return api.post('/admin/login', form, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

// ---- Admin Enquiries ----
export const fetchAdminEnquiries = (params?: { status?: string; search?: string; page?: number }) =>
  api.get('/enquiries/admin/all', { params })

export const fetchAdminEnquiry = (id: number) => api.get(`/enquiries/admin/${id}`)

export const updateEnquiryStatus = (id: number, status: string, admin_notes?: string) =>
  api.patch(`/enquiries/admin/${id}`, { status, admin_notes })

// ---- Admin Products ----
export const fetchAdminProducts = () => api.get('/products/admin/all')

export const createProduct = (data: Record<string, unknown>) =>
  api.post('/products/admin/create', data)

export const updateProduct = (id: number, data: Record<string, unknown>) =>
  api.patch(`/products/admin/${id}`, data)

export const deleteProduct = (id: number) => api.delete(`/products/admin/${id}`)

// ---- Admin Dashboard ----
export const fetchDashboard = () => api.get('/admin/dashboard')

// ---- Admin Settings ----
export const fetchSettings = () => api.get('/admin/settings')

export const updateSetting = (key: string, value: string) =>
  api.patch(`/admin/settings/${key}`, { value })
