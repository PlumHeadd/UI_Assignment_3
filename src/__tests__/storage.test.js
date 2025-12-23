import {
  loadBoardData,
  saveBoardData,
  loadSyncQueue,
  saveSyncQueue,
  addToSyncQueue,
  clearSyncQueue,
} from '../services/storage'

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('loadBoardData', () => {
    test('should return null when no data exists', () => {
      const result = loadBoardData()
      expect(result).toBe(null)
    })

    test('should return saved data', () => {
      const data = { lists: [], cards: [] }
      localStorage.setItem('kanban-board-data', JSON.stringify(data))

      const result = loadBoardData()
      expect(result).toEqual(data)
    })
  })

  describe('saveBoardData', () => {
    test('should save data to localStorage', () => {
      const data = { lists: [{ id: '1' }], cards: [] }
      saveBoardData(data)

      const saved = JSON.parse(localStorage.getItem('kanban-board-data'))
      expect(saved).toEqual(data)
    })
  })

  describe('loadSyncQueue', () => {
    test('should return empty array when no queue exists', () => {
      const result = loadSyncQueue()
      expect(result).toEqual([])
    })

    test('should return saved queue', () => {
      const queue = [{ id: '1', action: 'test' }]
      localStorage.setItem('kanban-sync-queue', JSON.stringify(queue))

      const result = loadSyncQueue()
      expect(result).toEqual(queue)
    })
  })

  describe('saveSyncQueue', () => {
    test('should save queue to localStorage', () => {
      const queue = [{ id: '1' }]
      saveSyncQueue(queue)

      const saved = JSON.parse(localStorage.getItem('kanban-sync-queue'))
      expect(saved).toEqual(queue)
    })
  })

  describe('addToSyncQueue', () => {
    test('should add action to queue', () => {
      addToSyncQueue({ actionType: 'CREATE_CARD', data: { title: 'test' } })

      const queue = loadSyncQueue()
      expect(queue.length).toBe(1)
      expect(queue[0].actionType).toBe('CREATE_CARD')
      expect(queue[0].timestamp).toBeDefined()
      expect(queue[0].id).toBeDefined()
    })
  })

  describe('clearSyncQueue', () => {
    test('should clear the queue', () => {
      addToSyncQueue({ actionType: 'TEST' })
      clearSyncQueue()

      const queue = loadSyncQueue()
      expect(queue).toEqual([])
    })
  })
})
