const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

async function request(path, opts) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`${res.status} ${res.statusText}: ${text}`)
  }
  if (res.status === 204) return null
  return res.json()
}

export const conferences = {
  list: () => request('/conferences'),
  get: (id) => request(`/conferences/${id}`),
  create: (data) => request('/conferences', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/conferences/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => request(`/conferences/${id}`, { method: 'DELETE' }),
}

export const visitors = {
  list: () => request('/visitors'),
  get: (id) => request(`/visitors/${id}`),
  create: (data) => request('/visitors', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/visitors/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => request(`/visitors/${id}`, { method: 'DELETE' }),
}

export const emailTemplates = {
  list: () => request('/email-templates'),
  get: (id) => request(`/email-templates/${id}`),
  create: (data) => request('/email-templates', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/email-templates/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => request(`/email-templates/${id}`, { method: 'DELETE' }),
}
