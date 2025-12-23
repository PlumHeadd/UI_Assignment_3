import { generateId, reorderArray, moveItemBetweenArrays, threeWayMerge } from '../utils/helpers'

describe('helpers', () => {
  describe('generateId', () => {
    test('should generate a valid UUID', () => {
      const id = generateId()
      expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
    })

    test('should generate unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
    })
  })

  describe('reorderArray', () => {
    test('should move item forward', () => {
      const arr = ['a', 'b', 'c', 'd']
      const result = reorderArray(arr, 0, 2)
      expect(result).toEqual(['b', 'c', 'a', 'd'])
    })

    test('should move item backward', () => {
      const arr = ['a', 'b', 'c', 'd']
      const result = reorderArray(arr, 3, 1)
      expect(result).toEqual(['a', 'd', 'b', 'c'])
    })

    test('should not mutate original array', () => {
      const arr = ['a', 'b', 'c']
      reorderArray(arr, 0, 2)
      expect(arr).toEqual(['a', 'b', 'c'])
    })
  })

  describe('moveItemBetweenArrays', () => {
    test('should move item between arrays', () => {
      const source = ['a', 'b', 'c']
      const destination = ['x', 'y']
      const result = moveItemBetweenArrays(source, destination, 1, 1)

      expect(result.source).toEqual(['a', 'c'])
      expect(result.destination).toEqual(['x', 'b', 'y'])
    })

    test('should not mutate original arrays', () => {
      const source = ['a', 'b', 'c']
      const destination = ['x', 'y']
      moveItemBetweenArrays(source, destination, 1, 1)

      expect(source).toEqual(['a', 'b', 'c'])
      expect(destination).toEqual(['x', 'y'])
    })
  })

  describe('threeWayMerge', () => {
    test('should return server when local unchanged', () => {
      const base = { title: 'Original' }
      const local = { title: 'Original' }
      const server = { title: 'Server Change' }

      const result = threeWayMerge(base, local, server)
      expect(result.merged).toEqual(server)
      expect(result.conflict).toBe(false)
    })

    test('should return local when server unchanged', () => {
      const base = { title: 'Original' }
      const local = { title: 'Local Change' }
      const server = { title: 'Original' }

      const result = threeWayMerge(base, local, server)
      expect(result.merged).toEqual(local)
      expect(result.conflict).toBe(false)
    })

    test('should detect conflict when both changed same field', () => {
      const base = { title: 'Original' }
      const local = { title: 'Local Change' }
      const server = { title: 'Server Change' }

      const result = threeWayMerge(base, local, server)
      expect(result.conflict).toBe(true)
    })

    test('should merge when different fields changed', () => {
      const base = { title: 'Original', description: 'Desc' }
      const local = { title: 'Changed', description: 'Desc' }
      const server = { title: 'Original', description: 'New Desc' }

      const result = threeWayMerge(base, local, server)
      expect(result.merged.title).toBe('Changed')
      expect(result.conflict).toBe(false)
    })
  })
})
