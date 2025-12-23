import { memo, useCallback } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export const Card = memo(function Card({ card, onEdit, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleClick = useCallback(() => {
    onEdit(card)
  }, [card, onEdit])

  const handleDelete = useCallback((e) => {
    e.stopPropagation()
    onDelete(card.id)
  }, [card.id, onDelete])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onEdit(card)
    }
    if (e.key === 'Delete') {
      onDelete(card.id)
    }
  }, [card, onEdit, onDelete])

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white p-3 rounded shadow mb-2 cursor-pointer hover:shadow-md border border-gray-200"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Card: ${card.title}`}
      {...attributes}
      {...listeners}
    >
      <h4 className="font-medium text-gray-800 mb-1">{card.title}</h4>
      {card.description && (
        <p className="text-sm text-gray-500 truncate">{card.description}</p>
      )}
      {card.tags && card.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {card.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100"
        aria-label={`Delete card ${card.title}`}
      >
        ×
      </button>
    </div>
  )
})
