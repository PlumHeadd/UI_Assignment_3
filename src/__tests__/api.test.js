import * as api from '../services/api'

describe('api', () => {
  beforeEach(() => {
    api.resetServerData()
    api.setMockDelay(0)
    api.setMockFailure(false)
  })

  describe('createList', () => {
    test('should create a new list', async () => {
      const list = { id: '1', title: 'Test List' }
      const result = await api.createList(list)

      expect(result.id).toBe('1')
      expect(result.title).toBe('Test List')
      expect(result.version).toBe(1)
      expect(result.lastModifiedAt).toBeDefined()
    })
  })

  describe('updateList', () => {
    test('should update existing list', async () => {
      await api.createList({ id: '1', title: 'Original' })
      const result = await api.updateList('1', { title: 'Updated' })

      expect(result.title).toBe('Updated')
      expect(result.version).toBe(2)
    })

    test('should throw error for non-existent list', async () => {
      await expect(api.updateList('999', { title: 'Test' })).rejects.toThrow('List not found')
    })
  })

  describe('deleteList', () => {
    test('should delete list and its cards', async () => {
      await api.createList({ id: 'l1', title: 'List' })
      await api.createCard({ id: 'c1', listId: 'l1', title: 'Card' })

      const result = await api.deleteList('l1')
      expect(result.success).toBe(true)

      const data = api.getServerData()
      expect(data.lists.length).toBe(0)
      expect(data.cards.length).toBe(0)
    })
  })

  describe('createCard', () => {
    test('should create a new card', async () => {
      const card = { id: 'c1', listId: 'l1', title: 'Test Card' }
      const result = await api.createCard(card)

      expect(result.id).toBe('c1')
      expect(result.title).toBe('Test Card')
      expect(result.version).toBe(1)
    })
  })

  describe('updateCard', () => {
    test('should update existing card', async () => {
      await api.createCard({ id: 'c1', title: 'Original' })
      const result = await api.updateCard('c1', { title: 'Updated' })

      expect(result.title).toBe('Updated')
      expect(result.version).toBe(2)
    })

    test('should throw error for non-existent card', async () => {
      await expect(api.updateCard('999', { title: 'Test' })).rejects.toThrow('Card not found')
    })
  })

  describe('deleteCard', () => {
    test('should delete card', async () => {
      await api.createCard({ id: 'c1', title: 'Card' })
      const result = await api.deleteCard('c1')

      expect(result.success).toBe(true)
      expect(api.getServerData().cards.length).toBe(0)
    })
  })

  describe('moveCard', () => {
    test('should move card to new list', async () => {
      await api.createCard({ id: 'c1', listId: 'l1', title: 'Card', order: 0 })
      const result = await api.moveCard('c1', 'l2', 0)

      expect(result.listId).toBe('l2')
      expect(result.order).toBe(0)
    })
  })

  describe('fetchAllData', () => {
    test('should return all data', async () => {
      await api.createList({ id: 'l1', title: 'List' })
      await api.createCard({ id: 'c1', title: 'Card' })

      const result = await api.fetchAllData()
      expect(result.lists.length).toBe(1)
      expect(result.cards.length).toBe(1)
    })
  })

  describe('mock failure', () => {
    test('should throw error when failure enabled', async () => {
      api.setMockFailure(true)
      await expect(api.fetchAllData()).rejects.toThrow('Network error')
    })
  })
})
