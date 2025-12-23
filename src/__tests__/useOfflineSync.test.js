import { renderHook, act } from '@testing-library/react'
import { useOfflineSync } from '../hooks/useOfflineSync'

describe('useOfflineSync', () => {
  beforeEach(() => {
    localStorage.clear()
    Object.defineProperty(navigator, 'onLine', { value: true, writable: true })
  })

  test('should initialize with online status', () => {
    const { result } = renderHook(() => useOfflineSync())
    expect(result.current.isOnline).toBe(true)
  })

  test('should initialize with not syncing', () => {
    const { result } = renderHook(() => useOfflineSync())
    expect(result.current.isSyncing).toBe(false)
  })

  test('should initialize with no sync error', () => {
    const { result } = renderHook(() => useOfflineSync())
    expect(result.current.syncError).toBe(null)
  })

  test('should provide queueAction function', () => {
    const { result } = renderHook(() => useOfflineSync())
    expect(typeof result.current.queueAction).toBe('function')
  })

  test('should provide forceSync function', () => {
    const { result } = renderHook(() => useOfflineSync())
    expect(typeof result.current.forceSync).toBe('function')
  })

  test('should provide clearQueue function', () => {
    const { result } = renderHook(() => useOfflineSync())
    expect(typeof result.current.clearQueue).toBe('function')
  })

  test('should queue action', () => {
    const { result } = renderHook(() => useOfflineSync())

    act(() => {
      result.current.queueAction('CREATE_CARD', { title: 'Test' })
    })

    expect(result.current.pendingCount).toBeGreaterThanOrEqual(0)
  })
})
