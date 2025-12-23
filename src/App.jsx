import { useState, useEffect, useCallback } from 'react'
import { BoardProvider } from './context/BoardProvider'
import { Header } from './components/Header'
import { Toolbar } from './components/Toolbar'
import { Board } from './components/Board'
import { useUndoRedo } from './hooks/useUndoRedo'
import { loadBoardData, saveBoardData } from './services/storage'
import './index.css'

function AppContent() {
  const initialData = loadBoardData() || { lists: [], cards: [] }
  const { pushState, undo, redo, canUndo, canRedo } = useUndoRedo(initialData)
  const [, forceUpdate] = useState({})

  const handleUndo = useCallback(() => {
    const prevState = undo()
    if (prevState) {
      saveBoardData(prevState)
      forceUpdate({})
      window.location.reload()
    }
  }, [undo])

  const handleRedo = useCallback(() => {
    const nextState = redo()
    if (nextState) {
      saveBoardData(nextState)
      forceUpdate({})
      window.location.reload()
    }
  }, [redo])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault()
        if (e.shiftKey) {
          handleRedo()
        } else {
          handleUndo()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleUndo, handleRedo])

  useEffect(() => {
    const interval = setInterval(() => {
      const currentData = loadBoardData()
      if (currentData) {
        pushState(currentData)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [pushState])

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />
      <Toolbar
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
      />
      <Board />
    </div>
  )
}

function App() {
  return (
    <BoardProvider>
      <AppContent />
    </BoardProvider>
  )
}

export default App
