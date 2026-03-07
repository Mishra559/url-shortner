import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Request interceptor
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
)

// Response interceptor — normalize errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

// ─────────────────────────────────────────
// API Methods
// ─────────────────────────────────────────

/**
 * Create a short URL
 * @param {string} originalUrl
 * @param {string|null} customAlias
 * @returns {Promise<{ shortUrl, originalUrl, shortCode }>}
 */
export const createShortUrl = async (originalUrl, customAlias = null) => {
  const payload = { originalUrl }
  if (customAlias && customAlias.trim()) {
    payload.customAlias = customAlias.trim()
  }
  const res = await api.post('/api/urls', payload)
  return res.data
}

/**
 * Get statistics for a short code
 * @param {string} shortCode
 * @returns {Promise<{ originalUrl, shortCode, shortUrl, clickCount, createdAt, updatedAt }>}
 */
export const getStats = async (shortCode) => {
  const res = await api.get(`/api/urls/${shortCode}`)
  return res.data
}

/**
 * Health check
 */
export const healthCheck = async () => {
  const res = await api.get('/api/health')
  return res.data
}

export default api
