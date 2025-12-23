import { renderHook, act } from '@testing-library/react'
import { useUndoRedo } from '../hooks/useUndoRedo'

describe('useUndoRedo', () => {
  test('should initialize with initial state', () => {
    const initialState = { value: 1 }
    const { result } = renderHook(() => useUndoRedo(initialState))

    expect(result.current.currentState).toEqual(initialState)
    expect(result.current.canUndo).toBe(false)
    expect(result.current.canRedo).toBe(false)
  })

  test('should push new state', () => {
    const { result } = renderHook(() => useUndoRedo({ value: 1 }))

    act(() => {
      result.current.pushState({ value: 2 })
    })

    expect(result.current.canUndo).toBe(true)
    expect(result.current.canRedo).toBe(false)
  })

  test('should undo to previous state', () => {
    const { result } = renderHook(() => useUndoRedo({ value: 1 }))

    act(() => {
      result.current.pushState({ value: 2 })
    })

    let undoneState
    act(() => {
      undoneState = result.current.undo()
    })

    expect(undoneState).toEqual({ value: 1 })
    expect(result.current.canUndo).toBe(false)
    expect(result.current.canRedo).toBe(true)
  })

  test('should redo to next state', () => {
    const { result } = renderHook(() => useUndoRedo({ value: 1 }))

    act(() => {
      result.current.pushState({ value: 2 })
    })

    act(() => {
      result.current.undo()
    })

    let redoneState
    act(() => {
      redoneState = result.current.redo()
    })

    expect(redoneState).toEqual({ value: 2 })
    expect(result.current.canUndo).toBe(true)
    expect(result.current.canRedo).toBe(false)
  })

  test('should return null when undoing at start', () => {
    const { result } = renderHook(() => useUndoRedo({ value: 1 }))

    let undoneState
    act(() => {
      undoneState = result.current.undo()
    })

    expect(undoneState).toBe(null)
  })

  test('should return null when redoing at end', () => {
    const { result } = renderHook(() => useUndoRedo({ value: 1 }))

    let redoneState
    act(() => {
      redoneState = result.current.redo()
    })

    expect(redoneState).toBe(null)
  })

  test('should clear redo history when pushing new state after undo', () => {
    const { result } = renderHook(() => useUndoRedo({ value: 1 }))

    act(() => {
      result.current.pushState({ value: 2 })
      result.current.pushState({ value: 3 })
    })

    act(() => {
      result.current.undo()
    })

    act(() => {
      result.current.pushState({ value: 4 })
    })

    expect(result.current.canRedo).toBe(false)
  })

  test('should clear history', () => {
    const { result } = renderHook(() => useUndoRedo({ value: 1 }))

    act(() => {
      result.current.pushState({ value: 2 })
      result.current.pushState({ value: 3 })
    })

    act(() => {
      result.current.clearHistory()
    })

    expect(result.current.canUndo).toBe(false)
    expect(result.current.canRedo).toBe(false)
  })
})
