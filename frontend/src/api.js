const configuredUrl = import.meta.env.VITE_API_URL

export const API_BASE_URL = (configuredUrl || 'http://localhost:47821').replace(/\/$/, '')

export function apiUrl(path) {
  const suffix = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${suffix}`
}
