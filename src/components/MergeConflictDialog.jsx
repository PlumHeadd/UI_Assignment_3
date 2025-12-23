import { useEffect, useRef } from 'react'

export function MergeConflictDialog({ isOpen, localData, serverData, onChooseLocal, onChooseServer, onCancel }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="conflict-dialog-title"
    >
      <div
        ref={dialogRef}
        className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 shadow-xl"
      >
        <h2 id="conflict-dialog-title" className="text-xl font-bold mb-4 text-red-600">
          Merge Conflict Detected
        </h2>
        <p className="text-gray-600 mb-4">
          The item has been modified both locally and on the server. Choose which version to keep:
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="border rounded p-4">
            <h3 className="font-bold mb-2">Local Version</h3>
            <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto max-h-40">
              {JSON.stringify(localData, null, 2)}
            </pre>
          </div>
          <div className="border rounded p-4">
            <h3 className="font-bold mb-2">Server Version</h3>
            <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto max-h-40">
              {JSON.stringify(serverData, null, 2)}
            </pre>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onChooseServer}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Use Server Version
          </button>
          <button
            onClick={onChooseLocal}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Use Local Version
          </button>
        </div>
      </div>
    </div>
  )
}
