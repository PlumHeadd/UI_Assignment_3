import { validateCard, validateList } from '../utils/validators'

describe('validators', () => {
  describe('validateCard', () => {
    test('should return valid for correct card', () => {
      const card = { title: 'Test Card', description: 'Description' }
      const result = validateCard(card)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    test('should return error for empty title', () => {
      const card = { title: '', description: 'Description' }
      const result = validateCard(card)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Title is required')
    })

    test('should return error for missing title', () => {
      const card = { description: 'Description' }
      const result = validateCard(card)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Title is required')
    })

    test('should return error for title over 200 chars', () => {
      const card = { title: 'a'.repeat(201) }
      const result = validateCard(card)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Title must be less than 200 characters')
    })

    test('should return error for description over 2000 chars', () => {
      const card = { title: 'Test', description: 'a'.repeat(2001) }
      const result = validateCard(card)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Description must be less than 2000 characters')
    })
  })

  describe('validateList', () => {
    test('should return valid for correct list', () => {
      const list = { title: 'Test List' }
      const result = validateList(list)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    test('should return error for empty title', () => {
      const list = { title: '' }
      const result = validateList(list)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('List title is required')
    })

    test('should return error for title over 100 chars', () => {
      const list = { title: 'a'.repeat(101) }
      const result = validateList(list)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('List title must be less than 100 characters')
    })
  })
})
