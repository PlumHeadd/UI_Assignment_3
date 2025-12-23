import { useState, useEffect, useCallback, useRef } from 'react'
import { loadSyncQueue, saveSyncQueue, addToSyncQueue, clearSyncQueue } from '../services/storage'
import * as api from '../services/api'

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncError, setSyncError] = useState(null)
  const syncIntervalRef = useRef(null)
  const isProcessingRef = useRef(false)

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

  const processQueue = useCallback(async () => {
    if (!isOnline || isProcessingRef.current) return

    const queue = loadSyncQueue()
    if (queue.length === 0) return

    isProcessingRef.current = true
    setIsSyncing(true)
    setSyncError(null)

    const failedItems = []

    for (const item of queue) {
      try {
        switch (item.actionType) {
          case 'CREATE_LIST':
            await api.createList(item.data)
            break
          case 'UPDATE_LIST':
            await api.updateList(item.data.id, item.data.updates)
            break
          case 'DELETE_LIST':
            await api.deleteList(item.data.id)
            break
          case 'CREATE_CARD':
            await api.createCard(item.data)
            break
          case 'UPDATE_CARD':
            await api.updateCard(item.data.id, item.data.updates)
            break
          case 'DELETE_CARD':
            await api.deleteCard(item.data.id)
            break
          case 'MOVE_CARD':
            await api.moveCard(item.data.cardId, item.data.targetListId, item.data.targetIndex)
            break
          default:
            break
        }
      } catch (error) {
        console.error('Sync error:', error)
        failedItems.push(item)
      }
    }

    saveSyncQueue(failedItems)
    setIsSyncing(false)
    isProcessingRef.current = false

    if (failedItems.length > 0) {
      setSyncError('Some changes failed to sync')
    }
  }, [isOnline])

  const queueAction = useCallback((actionType, data) => {
    addToSyncQueue({ actionType, data })
  }, [])

  useEffect(() => {
    if (isOnline) {
      const timer = setTimeout(() => {
        processQueue()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isOnline, processQueue])

  useEffect(() => {
    syncIntervalRef.current = setInterval(() => {
      if (isOnline) {
        processQueue()
      }
    }, 30000)

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current)
      }
    }
  }, [isOnline, processQueue])

  const forceSync = useCallback(async () => {
    await processQueue()
  }, [processQueue])

  const clearQueueFn = useCallback(() => {
    clearSyncQueue()
  }, [])

  return {
    isOnline,
    isSyncing,
    syncError,
    queueAction,
    forceSync,
    clearQueue: clearQueueFn,
    pendingCount: loadSyncQueue().length,
  }
}
