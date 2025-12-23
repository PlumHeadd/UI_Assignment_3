import { useState, useCallback, useMemo } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { FixedSizeList as List } from 'react-window'
import { Card } from './Card'
import { InlineEditor } from './InlineEditor'
import { ConfirmDialog } from './ConfirmDialog'

export function ListColumn({
  list,
  cards,
  onRenameList,
  onArchiveList,
  onAddCard,
  onEditCard,
  onDeleteCard,
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [isAddingCard, setIsAddingCard] = useState(false)
  const [newCardTitle, setNewCardTitle] = useState('')
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false)

  const { setNodeRef, isOver } = useDroppable({
    id: list.id,
  })

  const sortedCards = useMemo(() => {
    return [...cards].sort((a, b) => a.order - b.order)
  }, [cards])

  const cardIds = useMemo(() => sortedCards.map((c) => c.id), [sortedCards])

  const handleRename = useCallback((newTitle) => {
    onRenameList(list.id, newTitle)
    setIsEditing(false)
  }, [list.id, onRenameList])

  const handleAddCard = useCallback(() => {
    if (newCardTitle.trim()) {
      onAddCard(list.id, newCardTitle.trim())
      setNewCardTitle('')
      setIsAddingCard(false)
    }
  }, [list.id, newCardTitle, onAddCard])

  const handleCardKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddCard()
    } else if (e.key === 'Escape') {
      setIsAddingCard(false)
      setNewCardTitle('')
    }
  }

  const renderCard = useCallback(({ index, style }) => {
    const card = sortedCards[index]
    return (
      <div style={style}>
        <Card
          card={card}
          onEdit={onEditCard}
          onDelete={onDeleteCard}
        />
      </div>
    )
  }, [sortedCards, onEditCard, onDeleteCard])

  const useVirtualization = sortedCards.length > 30

  return (
    <div
      ref={setNodeRef}
      className={`flex-shrink-0 w-72 bg-gray-100 rounded-lg p-3 ${isOver ? 'ring-2 ring-blue-400' : ''}`}
    >
      <div className="flex items-center justify-between mb-3">
        {isEditing ? (
          <InlineEditor
            value={list.title}
            onSave={handleRename}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <h3
            className="font-bold text-gray-700 cursor-pointer hover:text-blue-600"
            onClick={() => setIsEditing(true)}
            onKeyDown={(e) => e.key === 'Enter' && setIsEditing(true)}
            tabIndex={0}
            role="button"
            aria-label={`Edit list title: ${list.title}`}
          >
            {list.title}
          </h3>
        )}
        <button
          onClick={() => setShowArchiveConfirm(true)}
          className="text-gray-400 hover:text-red-500 p-1"
          aria-label={`Archive list ${list.title}`}
        >
          ×
        </button>
      </div>

      <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
        <div className="min-h-[100px] max-h-[60vh] overflow-y-auto">
          {useVirtualization ? (
            <List
              height={400}
              itemCount={sortedCards.length}
              itemSize={100}
              width="100%"
            >
              {renderCard}
            </List>
          ) : (
            sortedCards.map((card) => (
              <Card
                key={card.id}
                card={card}
                onEdit={onEditCard}
                onDelete={onDeleteCard}
              />
            ))
          )}
        </div>
      </SortableContext>

      {isAddingCard ? (
        <div className="mt-3">
          <input
            type="text"
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            onKeyDown={handleCardKeyDown}
            placeholder="Enter card title"
            className="w-full px-3 py-2 border rounded mb-2"
            autoFocus
            aria-label="New card title"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddCard}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add
            </button>
            <button
              onClick={() => {
                setIsAddingCard(false)
                setNewCardTitle('')
              }}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAddingCard(true)}
          className="w-full mt-3 py-2 text-gray-500 hover:bg-gray-200 rounded"
          aria-label={`Add card to ${list.title}`}
        >
          + Add Card
        </button>
      )}

      <ConfirmDialog
        isOpen={showArchiveConfirm}
        title="Archive List"
        message={`Are you sure you want to archive "${list.title}"?`}
        onConfirm={() => {
          onArchiveList(list.id)
          setShowArchiveConfirm(false)
        }}
        onCancel={() => setShowArchiveConfirm(false)}
      />
    </div>
  )
}
