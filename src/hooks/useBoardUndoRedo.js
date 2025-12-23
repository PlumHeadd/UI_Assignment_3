import { useContext } from 'react'
import { UndoRedoContext } from '../context/BoardProvider'

export function useBoardUndoRedo() {
  const context = useContext(UndoRedoContext)
  if (!context) {
    throw new Error('useBoardUndoRedo must be used within BoardProvider')
  }
  return context
}
