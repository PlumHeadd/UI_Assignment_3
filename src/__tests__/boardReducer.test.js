import { boardReducer, initialState, ActionTypes } from '../context/boardReducer'

describe('boardReducer', () => {
  test('should return initial state', () => {
    const result = boardReducer(undefined, { type: 'UNKNOWN' })
    expect(result).toEqual(undefined)
  })

  test('should handle SET_BOARD_DATA', () => {
    const payload = {
      lists: [{ id: '1', title: 'Test List' }],
      cards: [{ id: '1', title: 'Test Card' }],
    }
    const result = boardReducer(initialState, {
      type: ActionTypes.SET_BOARD_DATA,
      payload,
    })
    expect(result.lists).toEqual(payload.lists)
    expect(result.cards).toEqual(payload.cards)
  })

  test('should handle ADD_LIST', () => {
    const result = boardReducer(initialState, {
      type: ActionTypes.ADD_LIST,
      payload: { title: 'New List' },
    })
    expect(result.lists.length).toBe(1)
    expect(result.lists[0].title).toBe('New List')
    expect(result.lists[0].id).toBeDefined()
  })

  test('should handle UPDATE_LIST', () => {
    const stateWithList = {
      ...initialState,
      lists: [{ id: '1', title: 'Old Title', version: 1 }],
    }
    const result = boardReducer(stateWithList, {
      type: ActionTypes.UPDATE_LIST,
      payload: { id: '1', updates: { title: 'New Title' } },
    })
    expect(result.lists[0].title).toBe('New Title')
    expect(result.lists[0].version).toBe(2)
  })

  test('should handle ARCHIVE_LIST', () => {
    const stateWithList = {
      ...initialState,
      lists: [{ id: '1', title: 'Test', archived: false }],
    }
    const result = boardReducer(stateWithList, {
      type: ActionTypes.ARCHIVE_LIST,
      payload: { id: '1' },
    })
    expect(result.lists[0].archived).toBe(true)
  })

  test('should handle DELETE_LIST and its cards', () => {
    const stateWithData = {
      ...initialState,
      lists: [{ id: '1', title: 'Test' }],
      cards: [
        { id: 'c1', listId: '1', title: 'Card 1' },
        { id: 'c2', listId: '2', title: 'Card 2' },
      ],
    }
    const result = boardReducer(stateWithData, {
      type: ActionTypes.DELETE_LIST,
      payload: { id: '1' },
    })
    expect(result.lists.length).toBe(0)
    expect(result.cards.length).toBe(1)
    expect(result.cards[0].listId).toBe('2')
  })

  test('should handle ADD_CARD', () => {
    const stateWithList = {
      ...initialState,
      lists: [{ id: 'list1', title: 'Test' }],
    }
    const result = boardReducer(stateWithList, {
      type: ActionTypes.ADD_CARD,
      payload: { listId: 'list1', title: 'New Card', description: 'Desc', tags: ['tag1'] },
    })
    expect(result.cards.length).toBe(1)
    expect(result.cards[0].title).toBe('New Card')
    expect(result.cards[0].listId).toBe('list1')
  })

  test('should handle UPDATE_CARD', () => {
    const stateWithCard = {
      ...initialState,
      cards: [{ id: 'c1', title: 'Old', version: 1 }],
    }
    const result = boardReducer(stateWithCard, {
      type: ActionTypes.UPDATE_CARD,
      payload: { id: 'c1', updates: { title: 'New' } },
    })
    expect(result.cards[0].title).toBe('New')
    expect(result.cards[0].version).toBe(2)
  })

  test('should handle DELETE_CARD', () => {
    const stateWithCards = {
      ...initialState,
      cards: [{ id: 'c1' }, { id: 'c2' }],
    }
    const result = boardReducer(stateWithCards, {
      type: ActionTypes.DELETE_CARD,
      payload: { id: 'c1' },
    })
    expect(result.cards.length).toBe(1)
    expect(result.cards[0].id).toBe('c2')
  })

  test('should handle MOVE_CARD within same list', () => {
    const stateWithCards = {
      ...initialState,
      cards: [
        { id: 'c1', listId: 'l1', order: 0 },
        { id: 'c2', listId: 'l1', order: 1 },
        { id: 'c3', listId: 'l1', order: 2 },
      ],
    }
    const result = boardReducer(stateWithCards, {
      type: ActionTypes.MOVE_CARD,
      payload: { cardId: 'c1', targetListId: 'l1', targetIndex: 2 },
    })
    const movedCard = result.cards.find((c) => c.id === 'c1')
    expect(movedCard.order).toBe(2)
  })

  test('should handle MOVE_CARD between lists', () => {
    const stateWithCards = {
      ...initialState,
      cards: [
        { id: 'c1', listId: 'l1', order: 0 },
        { id: 'c2', listId: 'l2', order: 0 },
      ],
    }
    const result = boardReducer(stateWithCards, {
      type: ActionTypes.MOVE_CARD,
      payload: { cardId: 'c1', targetListId: 'l2', targetIndex: 1 },
    })
    const movedCard = result.cards.find((c) => c.id === 'c1')
    expect(movedCard.listId).toBe('l2')
  })

  test('should handle SET_LOADING', () => {
    const result = boardReducer(initialState, {
      type: ActionTypes.SET_LOADING,
      payload: true,
    })
    expect(result.isLoading).toBe(true)
  })

  test('should handle SET_ERROR', () => {
    const result = boardReducer(initialState, {
      type: ActionTypes.SET_ERROR,
      payload: 'Something went wrong',
    })
    expect(result.error).toBe('Something went wrong')
  })
})
