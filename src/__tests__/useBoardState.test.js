import { renderHook } from '@testing-library/react'
import { useBoardState, useBoardDispatch } from '../hooks/useBoardState'
import { BoardProvider } from '../context/BoardProvider'

describe('useBoardState', () => {
  test('should throw error when used outside provider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      renderHook(() => useBoardState())
    }).toThrow('useBoardState must be used within BoardProvider')

    consoleSpy.mockRestore()
  })

  test('should return context value when used inside provider', () => {
    const wrapper = ({ children }) => <BoardProvider>{children}</BoardProvider>
    const { result } = renderHook(() => useBoardState(), { wrapper })

    expect(result.current).toHaveProperty('lists')
    expect(result.current).toHaveProperty('cards')
    expect(result.current).toHaveProperty('addList')
    expect(result.current).toHaveProperty('addCard')
  })
})

describe('useBoardDispatch', () => {
  test('should throw error when used outside provider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      renderHook(() => useBoardDispatch())
    }).toThrow('useBoardDispatch must be used within BoardProvider')

    consoleSpy.mockRestore()
  })

  test('should return dispatch function when used inside provider', () => {
    const wrapper = ({ children }) => <BoardProvider>{children}</BoardProvider>
    const { result } = renderHook(() => useBoardDispatch(), { wrapper })

    expect(typeof result.current).toBe('function')
  })
})
