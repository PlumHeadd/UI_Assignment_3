import { useState, useCallback, useEffect } from 'react'

const MAX_HISTORY = 50
const HISTORY_STORAGE_KEY = 'kanban_undo_history'
const INDEX_STORAGE_KEY = 'kanban_undo_index'

export function useUndoRedo(initialState) {
  // Load history and index from localStorage if available
  const loadPersistedState = () => {
    try {
      const savedHistory = localStorage.getItem(HISTORY_STORAGE_KEY)
      const savedIndex = localStorage.getItem(INDEX_STORAGE_KEY)

      if (savedHistory && savedIndex) {
        const history = JSON.parse(savedHistory)
        const index = parseInt(savedIndex, 10)
        return { history, index }
      }
    } catch (error) {
      console.warn('Failed to load undo/redo history:', error)
    }
    return { history: [initialState], index: 0 }
  }

  const { history: initHistory, index: initIndex } = loadPersistedState()
  const [history, setHistory] = useState(initHistory)
  const [currentIndex, setCurrentIndex] = useState(initIndex)

  // Persist history and index to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history))
      localStorage.setItem(INDEX_STORAGE_KEY, currentIndex.toString())
    } catch (error) {
      console.warn('Failed to persist undo/redo history:', error)
    }
  }, [history, currentIndex])

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
