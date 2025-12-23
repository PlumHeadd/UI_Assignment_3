import { useState, useCallback } from 'react'

const MAX_HISTORY = 50

export function useUndoRedo(initialState) {
  const [history, setHistory] = useState([initialState])
  const [currentIndex, setCurrentIndex] = useState(0)

  const pushState = useCallback((newState) => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, currentIndex + 1)
      newHistory.push(newState)
      if (newHistory.length > MAX_HISTORY) {
        newHistory.shift()
        return newHistory
      }
      return newHistory
    })
    setCurrentIndex((prev) => Math.min(prev + 1, MAX_HISTORY - 1))
  }, [currentIndex])

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
      return history[currentIndex - 1]
    }
    return null
  }, [currentIndex, history])

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      return history[currentIndex + 1]
    }
    return null
  }, [currentIndex, history])

  const canUndo = currentIndex > 0
  const canRedo = currentIndex < history.length - 1

  const clearHistory = useCallback(() => {
    setHistory([history[currentIndex]])
    setCurrentIndex(0)
  }, [history, currentIndex])

  return {
    pushState,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory,
    currentState: history[currentIndex],
  }
}
