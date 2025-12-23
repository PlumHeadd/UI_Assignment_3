import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BoardProvider } from '../context/BoardProvider'
import { useBoardState } from '../hooks/useBoardState'
import * as storage from '../services/storage'

// Mock the services
jest.mock('../services/backend')
jest.mock('../services/storage')
jest.mock('../utils/env', () => ({
  isBackendEnabled: () => false
}))

// Mock the backend module
jest.mock('../services/backend', () => ({
  fetchBoard: jest.fn(),
  createList: jest.fn(),
  updateList: jest.fn(),
  deleteList: jest.fn(),
  createCard: jest.fn(),
  updateCard: jest.fn(),
  deleteCard: jest.fn(),
  moveCard: jest.fn()
}))

const TestComponent = () => {
  const { lists, cards, addList, addCard, updateCard, deleteCard, moveCard } = useBoardState()

  return (
    <div>
      <div data-testid="lists-count">{lists.length}</div>
      <div data-testid="cards-count">{cards.length}</div>
      <button onClick={() => addList('Test List')}>Add List</button>
      <button onClick={() => addCard('list-1', 'Test Card', 'Description')}>Add Card</button>
      <button onClick={() => updateCard('card-1', { title: 'Updated' })}>Update Card</button>
      <button onClick={() => deleteCard('card-1')}>Delete Card</button>
      <button onClick={() => moveCard('card-1', 'list-2', 0)}>Move Card</button>
    </div>
  )
}

describe('BoardProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    storage.loadBoardData.mockResolvedValue({ lists: [], cards: [] })
    storage.saveBoardData.mockResolvedValue()
  })

  test('should initialize with empty state', async () => {
    render(
      <BoardProvider>
        <TestComponent />
      </BoardProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('lists-count')).toHaveTextContent('0')
      expect(screen.getByTestId('cards-count')).toHaveTextContent('0')
    })
  })

  test('should add a list', async () => {
    render(
      <BoardProvider>
        <TestComponent />
      </BoardProvider>
    )

    const addListButton = screen.getByText('Add List')
    fireEvent.click(addListButton)

    await waitFor(() => {
      expect(screen.getByTestId('lists-count')).toHaveTextContent('1')
    })
  })

  test('should add a card', async () => {
    render(
      <BoardProvider>
        <TestComponent />
      </BoardProvider>
    )

    const addListButton = screen.getByText('Add List')
    fireEvent.click(addListButton)

    const addCardButton = screen.getByText('Add Card')
    fireEvent.click(addCardButton)

    await waitFor(() => {
      expect(screen.getByTestId('cards-count')).toHaveTextContent('1')
    })
  })
})