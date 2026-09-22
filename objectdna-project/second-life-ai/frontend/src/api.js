const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')
const api = (path) => `${API_URL}/api${path}`

async function request(path, options) {
  const response = await fetch(api(path), options)
  if (!response.ok) throw new Error((await response.json().catch(() => null))?.detail || 'ObjectDNA service unavailable')
  return response.json()
}

export async function analyzeImage(file) {
  const body = new FormData()
  body.append('image', file)
  return request('/analyze', { method: 'POST', body })
}

export function analyzeDemo(key = 'table') {
  return request(`/analyze/demo?object_key=${encodeURIComponent(key)}`, { method: 'POST' })
}

export function listAnalyses() { return request('/analyses') }
export function getAnalysis(id) { return request(`/analyses/${id}`) }
export function deleteAnalysis(id) { return request(`/analyses/${id}`, { method: 'DELETE' }) }
