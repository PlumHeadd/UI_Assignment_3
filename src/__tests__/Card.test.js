import { render, screen, fireEvent } from '@testing-library/react'
import { Card } from '../components/Card'
import { DndContext } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'

const mockCard = {
  id: '1',
  title: 'Test Card',
  description: 'Test description',
  tags: ['tag1', 'tag2'],
}

const renderCard = (card = mockCard, onEdit = jest.fn(), onDelete = jest.fn()) => {
  return render(
    <DndContext>
      <SortableContext items={[card.id]}>
        <Card card={card} onEdit={onEdit} onDelete={onDelete} />
      </SortableContext>
    </DndContext>
  )
}

describe('Card', () => {
  test('should render card title', () => {
    renderCard()
    expect(screen.getByText('Test Card')).toBeInTheDocument()
  })

  test('should render card description', () => {
    renderCard()
    expect(screen.getByText('Test description')).toBeInTheDocument()
  })

  test('should render tags', () => {
    renderCard()
    expect(screen.getByText('tag1')).toBeInTheDocument()
    expect(screen.getByText('tag2')).toBeInTheDocument()
  })

  test('should call onEdit when clicked', () => {
    const onEdit = jest.fn()
    renderCard(mockCard, onEdit)

    fireEvent.click(screen.getByRole('button', { name: /Card: Test Card/i }))
    expect(onEdit).toHaveBeenCalledWith(mockCard)
  })

  test('should have accessible label', () => {
    renderCard()
    expect(screen.getByRole('button', { name: /Card: Test Card/i })).toBeInTheDocument()
  })

  test('should be focusable', () => {
    renderCard()
    const card = screen.getByRole('button', { name: /Card: Test Card/i })
    expect(card).toHaveAttribute('tabindex', '0')
  })
})
