import { generateId } from '../utils/helpers'

export const initialState = {
  lists: [],
  cards: [],
  isLoading: false,
  error: null,
  lastSyncedAt: null,
}

export const ActionTypes = {
  SET_BOARD_DATA: 'SET_BOARD_DATA',
  ADD_LIST: 'ADD_LIST',
  UPDATE_LIST: 'UPDATE_LIST',
  ARCHIVE_LIST: 'ARCHIVE_LIST',
  DELETE_LIST: 'DELETE_LIST',
  ADD_CARD: 'ADD_CARD',
  UPDATE_CARD: 'UPDATE_CARD',
  DELETE_CARD: 'DELETE_CARD',
  MOVE_CARD: 'MOVE_CARD',
  REORDER_CARDS: 'REORDER_CARDS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SYNC_SUCCESS: 'SYNC_SUCCESS',
  REVERT_STATE: 'REVERT_STATE',
}

export function boardReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_BOARD_DATA:
      return {
        ...state,
        lists: action.payload.lists || [],
        cards: action.payload.cards || [],
        isLoading: false,
      }

    case ActionTypes.ADD_LIST: {
      const newList = {
        id: action.payload.id || generateId(),
        title: action.payload.title,
        archived: false,
        order: state.lists.length,
        version: 1,
        lastModifiedAt: Date.now(),
      }
      return {
        ...state,
        lists: [...state.lists, newList],
      }
    }

    case ActionTypes.UPDATE_LIST: {
      return {
        ...state,
        lists: state.lists.map((list) =>
          list.id === action.payload.id
            ? {
                ...list,
                ...action.payload.updates,
                version: list.version + 1,
                lastModifiedAt: Date.now(),
              }
            : list
        ),
      }
    }

    case ActionTypes.ARCHIVE_LIST: {
      return {
        ...state,
        lists: state.lists.map((list) =>
          list.id === action.payload.id
            ? { ...list, archived: true, lastModifiedAt: Date.now() }
            : list
        ),
      }
    }

    case ActionTypes.DELETE_LIST: {
      return {
        ...state,
        lists: state.lists.filter((list) => list.id !== action.payload.id),
        cards: state.cards.filter((card) => card.listId !== action.payload.id),
      }
    }

    case ActionTypes.ADD_CARD: {
      const listCards = state.cards.filter((c) => c.listId === action.payload.listId)
      const newCard = {
        id: action.payload.id || generateId(),
        listId: action.payload.listId,
        title: action.payload.title,
        description: action.payload.description || '',
        tags: action.payload.tags || [],
        order: listCards.length,
        version: 1,
        lastModifiedAt: Date.now(),
      }
      return {
        ...state,
        cards: [...state.cards, newCard],
      }
    }

    case ActionTypes.UPDATE_CARD: {
      return {
        ...state,
        cards: state.cards.map((card) =>
          card.id === action.payload.id
            ? {
                ...card,
                ...action.payload.updates,
                version: card.version + 1,
                lastModifiedAt: Date.now(),
              }
            : card
        ),
      }
    }

    case ActionTypes.DELETE_CARD: {
      return {
        ...state,
        cards: state.cards.filter((card) => card.id !== action.payload.id),
      }
    }

    case ActionTypes.MOVE_CARD: {
      const { cardId, targetListId, targetIndex } = action.payload
      const cardIndex = state.cards.findIndex((c) => c.id === cardId)
      if (cardIndex === -1) return state

      const card = state.cards[cardIndex]
      const sourceListId = card.listId

      let newCards = [...state.cards]

      if (sourceListId === targetListId) {
        const listCards = newCards
          .filter((c) => c.listId === sourceListId)
          .sort((a, b) => a.order - b.order)

        const currentIndex = listCards.findIndex((c) => c.id === cardId)
        const [moved] = listCards.splice(currentIndex, 1)
        listCards.splice(targetIndex, 0, moved)

        listCards.forEach((c, idx) => {
          const i = newCards.findIndex((nc) => nc.id === c.id)
          newCards[i] = { ...newCards[i], order: idx, lastModifiedAt: Date.now() }
        })
      } else {
        const sourceCards = newCards
          .filter((c) => c.listId === sourceListId)
          .sort((a, b) => a.order - b.order)
        const targetCards = newCards
          .filter((c) => c.listId === targetListId)
          .sort((a, b) => a.order - b.order)

        const currentIndex = sourceCards.findIndex((c) => c.id === cardId)
        const [moved] = sourceCards.splice(currentIndex, 1)
        moved.listId = targetListId
        moved.lastModifiedAt = Date.now()
        targetCards.splice(targetIndex, 0, moved)

        sourceCards.forEach((c, idx) => {
          const i = newCards.findIndex((nc) => nc.id === c.id)
          newCards[i] = { ...newCards[i], order: idx, lastModifiedAt: Date.now() }
        })

        targetCards.forEach((c, idx) => {
          const i = newCards.findIndex((nc) => nc.id === c.id)
          newCards[i] = { ...newCards[i], order: idx, listId: targetListId, lastModifiedAt: Date.now() }
        })
      }

      return { ...state, cards: newCards }
    }

    case ActionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload }

    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false }

    case ActionTypes.CLEAR_ERROR:
      return { ...state, error: null }

    case ActionTypes.SYNC_SUCCESS:
      return { ...state, lastSyncedAt: Date.now() }

    case ActionTypes.REVERT_STATE:
      return { ...state, ...action.payload }

    default:
      return state
  }
}
