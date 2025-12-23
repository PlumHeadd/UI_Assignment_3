import { fetchBoard, createList, updateList, deleteList, createCard, updateCard, deleteCard, moveCard } from '../services/backend'

// Mock fetch
global.fetch = jest.fn()

describe('backend service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock the env module
    jest.doMock('../utils/env', () => ({
      getEnvVar: jest.fn(() => 'http://localhost:5000')
    }))
  })

  afterEach(() => {
    jest.resetModules()
  })

  describe('fetchBoard', () => {
    test('should fetch board data successfully', async () => {
      const mockData = { lists: [], cards: [] }
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData)
      })

      const result = await fetchBoard()

      expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/board', {
        headers: { 'Content-Type': 'application/json' }
      })
      expect(result).toEqual(mockData)
    })

    test('should throw error on failed request', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: () => Promise.resolve('Server Error')
      })

      await expect(fetchBoard()).rejects.toThrow('Server Error')
    })
  })

  describe('createList', () => {
    test('should create list successfully', async () => {
      const listData = { title: 'Test List', order: 0 }
      const mockResponse = { id: 'list-1', ...listData }

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await createList(listData)

      expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(listData)
      })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('updateList', () => {
    test('should update list successfully', async () => {
      const updates = { title: 'Updated List' }
      const mockResponse = { id: 'list-1', title: 'Updated List' }

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await updateList('list-1', updates)

      expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/lists/list-1', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('deleteList', () => {
    test('should delete list successfully', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 204
      })

      const result = await deleteList('list-1')

      expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/lists/list-1', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })
      expect(result).toBeNull()
    })
  })

  describe('createCard', () => {
    test('should create card successfully', async () => {
      const cardData = { title: 'Test Card', listId: 'list-1', order: 0 }
      const mockResponse = { id: 'card-1', ...cardData }

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await createCard(cardData)

      expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cardData)
      })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('updateCard', () => {
    test('should update card successfully', async () => {
      const updates = { title: 'Updated Card', listId: 'list-2', order: 1 }
      const mockResponse = { id: 'card-1', title: 'Updated Card' }

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await updateCard('card-1', updates)

      expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/cards/card-1', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('deleteCard', () => {
    test('should delete card successfully', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 204
      })

      const result = await deleteCard('card-1')

      expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/cards/card-1', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })
      expect(result).toBeNull()
    })
  })

  describe('moveCard', () => {
    test('should move card successfully', async () => {
      const mockResponse = { id: 'card-1', listId: 'list-2', order: 1 }

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await moveCard('card-1', 'list-2', 1)

      expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/cards/card-1/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetListId: 'list-2', targetIndex: 1 })
      })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('environment configuration', () => {
    test('should use default URL when env var not set', async () => {
      // Reset modules to clear any cached env values
      jest.resetModules()

      // Mock env to return undefined
      jest.doMock('../utils/env', () => ({
        getEnvVar: () => undefined
      }))

      // Re-import backend after mocking
      const { fetchBoard } = require('../services/backend')

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({})
      })

      await fetchBoard()

      expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/board', expect.any(Object))
    })
  })
})