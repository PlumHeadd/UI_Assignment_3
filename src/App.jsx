import { useEffect, useCallback, useState } from 'react'
import { BoardProvider } from './context/BoardProvider'
import { Header } from './components/Header'
import { Toolbar } from './components/Toolbar'
import { Board } from './components/Board'
import { useBoardUndoRedo } from './hooks/useBoardUndoRedo'
import './index.css'

function AppContent() {
  const { undo, redo, canUndo, canRedo } = useBoardUndoRedo()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleUndo = useCallback(async () => {
    if (isProcessing) return
    setIsProcessing(true)

    const success = await undo()
    if (success) {
      console.log('✅ Undo successful, reloading...')
      setTimeout(() => {
        window.location.reload()
      }, 100)
    } else {
      setIsProcessing(false)
    }
  }, [undo, isProcessing])

  const handleRedo = useCallback(async () => {
    if (isProcessing) return
    setIsProcessing(true)

    const success = await redo()
    if (success) {
      console.log('✅ Redo successful, reloading...')
      setTimeout(() => {
        window.location.reload()
      }, 100)
    } else {
      setIsProcessing(false)
    }
  }, [redo, isProcessing])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !isProcessing) {
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
  }, [handleUndo, handleRedo, isProcessing])

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />
      <Toolbar
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo && !isProcessing}
        canRedo={canRedo && !isProcessing}
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
