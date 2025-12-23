import { useState, useEffect } from 'react'

export function Header() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Kanban Board</h1>
        <div className="flex items-center gap-4">
          <span
            className={`px-2 py-1 rounded text-sm ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}
            role="status"
            aria-live="polite"
          >
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>
    </header>
  )
}
