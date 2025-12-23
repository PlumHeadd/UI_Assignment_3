import { getEnvVar } from '../utils/env.js'

const BASE_URL = getEnvVar('VITE_BACKEND_URL') || 'http://localhost:5000'

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Request failed: ${res.status}`)
  }
  return res.status === 204 ? null : res.json()
}

export async function fetchBoard() {
  return request('/api/board')
}

export async function createList(list) {
  return request('/api/lists', { method: 'POST', body: JSON.stringify(list) })
}

export async function updateList(id, updates) {
  return request(`/api/lists/${id}`, { method: 'PATCH', body: JSON.stringify(updates) })
}

export async function deleteList(id) {
  return request(`/api/lists/${id}`, { method: 'DELETE' })
}

export async function createCard(card) {
  return request('/api/cards', { method: 'POST', body: JSON.stringify(card) })
}

export async function updateCard(id, updates) {
  return request(`/api/cards/${id}`, { method: 'PATCH', body: JSON.stringify(updates) })
}

export async function deleteCard(id) {
  return request(`/api/cards/${id}`, { method: 'DELETE' })
}

export async function moveCard(id, targetListId, targetIndex) {
  return request(`/api/cards/${id}/move`, {
    method: 'POST',
    body: JSON.stringify({ targetListId, targetIndex }),
  })
}
