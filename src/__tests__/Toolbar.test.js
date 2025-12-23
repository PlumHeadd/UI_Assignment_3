import { render, screen, fireEvent } from '@testing-library/react'
import { Toolbar } from '../components/Toolbar'
import { BoardProvider } from '../context/BoardProvider'

const renderToolbar = (props = {}) => {
  const defaultProps = {
    onUndo: jest.fn(),
    onRedo: jest.fn(),
    canUndo: false,
    canRedo: false,
    ...props,
  }

  return render(
    <BoardProvider>
      <Toolbar {...defaultProps} />
    </BoardProvider>
  )
}

describe('Toolbar', () => {
  test('should render undo button', () => {
    renderToolbar()
    expect(screen.getByRole('button', { name: /undo/i })).toBeInTheDocument()
  })

  test('should render redo button', () => {
    renderToolbar()
    expect(screen.getByRole('button', { name: /redo/i })).toBeInTheDocument()
  })

  test('should render add list button', () => {
    renderToolbar()
    expect(screen.getByRole('button', { name: /add new list/i })).toBeInTheDocument()
  })

  test('should disable undo when canUndo is false', () => {
    renderToolbar({ canUndo: false })
    expect(screen.getByRole('button', { name: /undo/i })).toBeDisabled()
  })

  test('should disable redo when canRedo is false', () => {
    renderToolbar({ canRedo: false })
    expect(screen.getByRole('button', { name: /redo/i })).toBeDisabled()
  })

  test('should call onUndo when clicked', () => {
    const onUndo = jest.fn()
    renderToolbar({ onUndo, canUndo: true })

    fireEvent.click(screen.getByRole('button', { name: /undo/i }))
    expect(onUndo).toHaveBeenCalled()
  })

  test('should show input when add list clicked', () => {
    renderToolbar()
    fireEvent.click(screen.getByRole('button', { name: /add new list/i }))
    expect(screen.getByPlaceholderText('Enter list title')).toBeInTheDocument()
  })
})
