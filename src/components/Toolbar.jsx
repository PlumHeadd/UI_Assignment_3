import { useState } from 'react'
import { useBoardState } from '../hooks/useBoardState'

export function Toolbar({ onUndo, onRedo, canUndo, canRedo }) {
  const { addList } = useBoardState()
  const [newListTitle, setNewListTitle] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const handleAddList = () => {
    if (newListTitle.trim()) {
      addList(newListTitle.trim())
      setNewListTitle('')
      setIsAdding(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddList()
    } else if (e.key === 'Escape') {
      setIsAdding(false)
      setNewListTitle('')
    }
  }

  return (
    <div className="bg-gray-100 p-4 border-b flex items-center gap-4">
      <div className="flex gap-2">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
          aria-label="Undo"
        >
          Undo
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
          aria-label="Redo"
        >
          Redo
        </button>
      </div>

      <div className="flex-1" />

      {isAdding ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter list title"
            className="px-3 py-1 border rounded"
            autoFocus
            aria-label="New list title"
          />
          <button
            onClick={handleAddList}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add
          </button>
          <button
            onClick={() => {
              setIsAdding(false)
              setNewListTitle('')
            }}
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          aria-label="Add new list"
        >
          + Add List
        </button>
      )}
    </div>
  )
}
