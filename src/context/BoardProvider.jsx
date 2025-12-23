import { createContext, useReducer, useEffect, useCallback, useState, useRef } from 'react'
import { boardReducer, initialState, ActionTypes } from './boardReducer'
import { loadBoardData, saveBoardData } from '../services/storage'
import * as backend from '../services/backend'
import { isBackendEnabled } from '../utils/env'
import { threeWayMerge } from '../utils/merge'

const BoardContext = createContext(null)
const BoardDispatchContext = createContext(null)

export { BoardContext, BoardDispatchContext }

export function BoardProvider({ children }) {
  const [state, dispatch] = useReducer(boardReducer, initialState)
  const [baseState, setBaseState] = useState({ lists: [], cards: [] })
  const syncInProgressRef = useRef(false)

  useEffect(() => {
    const backendUrl = isBackendEnabled()
    if (backendUrl) {
      (async () => {
        dispatch({ type: ActionTypes.SET_LOADING, payload: true })
        try {
          const data = await backend.fetchBoard()
          dispatch({ type: ActionTypes.SET_BOARD_DATA, payload: data })
          setBaseState(data)
        } catch (err) {
          console.warn('Backend (MongoDB) unavailable, falling back to localStorage:', err)
          const saved = loadBoardData()
          if (saved) {
            dispatch({ type: ActionTypes.SET_BOARD_DATA, payload: saved })
            setBaseState(saved)
          } else {
            dispatch({ type: ActionTypes.SET_LOADING, payload: false })
          }
        }
      })()
    } else {
      const saved = loadBoardData()
      if (saved) {
        dispatch({ type: ActionTypes.SET_BOARD_DATA, payload: saved })
        setBaseState(saved)
      }
    }
  }, [])

  useEffect(() => {
    if (state.lists.length > 0 || state.cards.length > 0) {
      saveBoardData({ lists: state.lists, cards: state.cards })
    }
  }, [state.lists, state.cards])

  useEffect(() => {
    if (!isBackendEnabled() || state.isLoading || syncInProgressRef.current) return

    const syncTimer = setTimeout(async () => {
      await syncToBackend()
    }, 1000)

    return () => clearTimeout(syncTimer)
  }, [state.lists, state.cards, state.isLoading])

  useEffect(() => {
    if (!isBackendEnabled()) return

    const handleOnline = async () => {
      await syncToBackend()
    }

    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
  }, [])

  useEffect(() => {
    if (!isBackendEnabled()) return

    const periodicSync = setInterval(async () => {
      if (navigator.onLine && !syncInProgressRef.current) {
        console.log('🔄 Periodic sync running...')
        await syncToBackend()
      }
    }, 30000)

    return () => clearInterval(periodicSync)
  }, [])

const syncToBackend = async () => {
  if (syncInProgressRef.current) return
  syncInProgressRef.current = true

  try {
    const backendData = await backend.fetchBoard()
    const detectedConflicts = []

    for (const list of state.lists) {
      const existingList = backendData.lists.find(l => l.id === list.id)
      const baseList = baseState.lists.find(l => l.id === list.id)

      if (!existingList) {
        await backend.createList(list)
      } else if (list.lastModifiedAt > existingList.lastModifiedAt) {
        const mergeResult = threeWayMerge(baseList, list, existingList)

        if (mergeResult.hasConflict) {
          detectedConflicts.push({ type: 'list', id: list.id, ...mergeResult })
        }

        await backend.updateList(list.id, mergeResult.merged)
      }
    }

    for (const backendList of backendData.lists) {
      if (!state.lists.find(l => l.id === backendList.id)) {
        await backend.deleteList(backendList.id)
      }
    }

    for (const card of state.cards) {
      const existingCard = backendData.cards.find(c => c.id === card.id)

      if (!existingCard) {
        await backend.createCard(card)
      } else {
        const localNewer = card.lastModifiedAt > existingCard.lastModifiedAt
        const listIdChanged = card.listId !== existingCard.listId
        const orderChanged = card.order !== existingCard.order
        const titleChanged = card.title !== existingCard.title
        const descChanged = card.description !== existingCard.description

        if (localNewer || listIdChanged || orderChanged || titleChanged || descChanged) {
          await backend.updateCard(card.id, {
            listId: card.listId,
            order: card.order,
            title: card.title,
            description: card.description,
            tags: card.tags,
            lastModifiedAt: card.lastModifiedAt
          })
        }
      }
    }

    for (const backendCard of backendData.cards) {
      const localCard = state.cards.find(c => c.id === backendCard.id)
      if (!localCard) {
        const cardAge = Date.now() - backendCard.lastModifiedAt
        if (cardAge > 5000) {
          await backend.deleteCard(backendCard.id)
        }
      }
    }

    setBaseState({ lists: state.lists, cards: state.cards })

  } catch (error) {
    console.warn('Backend sync failed:', error)
  } finally {
    syncInProgressRef.current = false
  }
}

  const addList = useCallback((title) => {
    dispatch({ type: ActionTypes.ADD_LIST, payload: { title } })
  }, []);

  const updateList = useCallback((id, updates) => {
    dispatch({ type: ActionTypes.UPDATE_LIST, payload: { id, updates } })
  }, [])

  const archiveList = useCallback((id) => {
    dispatch({ type: ActionTypes.ARCHIVE_LIST, payload: { id } })
  }, [])

  const deleteList = useCallback((id) => {
    dispatch({ type: ActionTypes.DELETE_LIST, payload: { id } })
  }, [])

  const addCard = useCallback((listId, title, description = '', tags = []) => {
    dispatch({ type: ActionTypes.ADD_CARD, payload: { listId, title, description, tags } })
  }, [])

  const updateCard = useCallback((id, updates) => {
    dispatch({ type: ActionTypes.UPDATE_CARD, payload: { id, updates } })
  }, [])

  const deleteCard = useCallback((id) => {
    dispatch({ type: ActionTypes.DELETE_CARD, payload: { id } })
  }, [])

  const moveCard = useCallback((cardId, targetListId, targetIndex) => {
    dispatch({ type: ActionTypes.MOVE_CARD, payload: { cardId, targetListId, targetIndex } })
  }, [])

  const value = {
    ...state,
    addList,
    updateList,
    archiveList,
    deleteList,
    addCard,
    updateCard,
    deleteCard,
    moveCard,
  }

  return (
    <BoardContext.Provider value={value}>
      <BoardDispatchContext.Provider value={dispatch}>
        {children}
      </BoardDispatchContext.Provider>
    </BoardContext.Provider>
  )
}
