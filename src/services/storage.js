const STORAGE_KEY = 'kanban-board-data'
const SYNC_QUEUE_KEY = 'kanban-sync-queue'

export function loadBoardData() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      return JSON.parse(data)
    }
  } catch (err) {
    console.error('Failed to load from localStorage:', err)
  }
  return null
}

export function saveBoardData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (err) {
    console.error('Failed to save to localStorage:', err)
  }
}

export function loadSyncQueue() {
  try {
    const queue = localStorage.getItem(SYNC_QUEUE_KEY)
    if (queue) {
      return JSON.parse(queue)
    }
  } catch (err) {
    console.error('Failed to load sync queue:', err)
  }
  return []
}

export function saveSyncQueue(queue) {
  try {
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue))
  } catch (err) {
    console.error('Failed to save sync queue:', err)
  }
}

export function addToSyncQueue(action) {
  const queue = loadSyncQueue()
  queue.push({
    ...action,
    timestamp: Date.now(),
    id: crypto.randomUUID(),
  })
  saveSyncQueue(queue)
}

export function removeFromSyncQueue(actionId) {
  const queue = loadSyncQueue()
  const newQueue = queue.filter((item) => item.id !== actionId)
  saveSyncQueue(newQueue)
}

export function clearSyncQueue() {
  saveSyncQueue([])
}
