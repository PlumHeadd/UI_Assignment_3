import { threeWayMerge } from '../utils/merge'

describe('threeWayMerge', () => {
  test('should return server version when base and local are equal', () => {
    const base = { id: 'card-1', title: 'Base Title', listId: 'list-1', order: 0 }
    const local = { id: 'card-1', title: 'Base Title', listId: 'list-1', order: 0 }
    const server = { id: 'card-1', title: 'Server Title', listId: 'list-1', order: 0 }

    const result = threeWayMerge(base, local, server)

    expect(result.merged.title).toBe('Server Title')
    expect(result.hasConflict).toBe(false) // No conflict since only server changed
  })

  test('should return local version when base and server are equal', () => {
    const base = { id: 'card-1', title: 'Base Title', listId: 'list-1', order: 0 }
    const server = { id: 'card-1', title: 'Base Title', listId: 'list-1', order: 0 }
    const local = { id: 'card-1', title: 'Local Title', listId: 'list-1', order: 0 }

    const result = threeWayMerge(base, local, server)

    expect(result.merged.title).toBe('Local Title')
    expect(result.hasConflict).toBe(false) // No conflict since only local changed
  })

  test('should merge when all three versions differ', () => {
    const base = { id: 'card-1', title: 'Base Title', listId: 'list-1', order: 0 }
    const local = { id: 'card-1', title: 'Local Title', listId: 'list-2', order: 1 }
    const server = { id: 'card-1', title: 'Server Title', listId: 'list-1', order: 2 }

    const result = threeWayMerge(base, local, server)

    // Should prioritize local changes for drag operations (listId/order)
    expect(result.merged.listId).toBe('list-2')
    expect(result.merged.order).toBe(1)
    expect(result.merged.title).toBe('Local Title') // Local wins for non-drag fields when conflict
    expect(result.hasConflict).toBe(true)
  })

  test('should handle undefined base version', () => {
    const local = { id: 'card-1', title: 'Local Title', listId: 'list-1', order: 0, lastModifiedAt: 100 }
    const server = { id: 'card-1', title: 'Server Title', listId: 'list-1', order: 0, lastModifiedAt: 200 }

    const result = threeWayMerge(undefined, local, server)

    expect(result.title).toBe('Server Title') // Server is newer
    expect(result).not.toHaveProperty('merged') // Returns object directly when no base
  })

  test('should prioritize local changes for drag-related fields', () => {
    const base = { id: 'card-1', title: 'Base', listId: 'list-1', order: 0, description: 'Base desc' }
    const local = { id: 'card-1', title: 'Local', listId: 'list-2', order: 1, description: 'Local desc' }
    const server = { id: 'card-1', title: 'Server', listId: 'list-1', order: 2, description: 'Server desc' }

    const result = threeWayMerge(base, local, server)

    // Local should win for drag fields
    expect(result.merged.listId).toBe('list-2')
    expect(result.merged.order).toBe(1)
    // Local should win for other fields when conflict
    expect(result.merged.title).toBe('Local')
    expect(result.merged.description).toBe('Local desc')
    expect(result.hasConflict).toBe(true)
  })

  test('should return no conflict when local and server are identical', () => {
    const base = { id: 'card-1', title: 'Base Title', listId: 'list-1', order: 0 }
    const local = { id: 'card-1', title: 'Same Title', listId: 'list-1', order: 0 }
    const server = { id: 'card-1', title: 'Same Title', listId: 'list-1', order: 0 }

    const result = threeWayMerge(base, local, server)

    expect(result.hasConflict).toBe(false)
    expect(result.merged.title).toBe('Same Title')
  })

  test('should return no conflict when local and server are identical', () => {
    const base = { id: 'card-1', title: 'Base Title', listId: 'list-1', order: 0 }
    const local = { id: 'card-1', title: 'Same Title', listId: 'list-1', order: 0 }
    const server = { id: 'card-1', title: 'Same Title', listId: 'list-1', order: 0 }

    const result = threeWayMerge(base, local, server)

    expect(result.hasConflict).toBe(false)
    expect(result.merged.title).toBe('Same Title')
  })
})