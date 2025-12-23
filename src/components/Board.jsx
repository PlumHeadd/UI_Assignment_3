import { useState, useCallback, useMemo, lazy, Suspense } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useBoardState } from '../hooks/useBoardState'
import { ListColumn } from './ListColumn'
import { Card } from './Card'

const CardDetailModal = lazy(() =>
  import('./CardDetailModal').then((m) => ({ default: m.CardDetailModal }))
)

export function Board() {
  const {
    lists,
    cards,
    updateList,
    archiveList,
    addCard,
    updateCard,
    deleteCard,
    moveCard,
  } = useBoardState()

  const [activeCard, setActiveCard] = useState(null)
  const [selectedCard, setSelectedCard] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const visibleLists = useMemo(() => {
    return lists.filter((l) => !l.archived).sort((a, b) => a.order - b.order)
  }, [lists])

  const getListCards = useCallback(
    (listId) => {
      return cards.filter((c) => c.listId === listId)
    },
    [cards]
  )

  const handleDragStart = useCallback((event) => {
    const { active } = event
    const card = cards.find((c) => c.id === active.id)
    setActiveCard(card)
  }, [cards])

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event
    setActiveCard(null)

    if (!over) return

    const activeCard = cards.find((c) => c.id === active.id)
    if (!activeCard) return

    const overId = over.id
    const overCard = cards.find((c) => c.id === overId)

    let targetListId
    let targetIndex

    if (overCard) {
      targetListId = overCard.listId
      const listCards = cards
        .filter((c) => c.listId === targetListId)
        .sort((a, b) => a.order - b.order)
      targetIndex = listCards.findIndex((c) => c.id === overId)
    } else {
      targetListId = overId
      const listCards = cards.filter((c) => c.listId === targetListId)
      targetIndex = listCards.length
    }

    if (activeCard.listId !== targetListId || activeCard.order !== targetIndex) {
      moveCard(active.id, targetListId, targetIndex)
    }
  }, [cards, moveCard])

  const handleRenameList = useCallback((listId, newTitle) => {
    updateList(listId, { title: newTitle })
  }, [updateList])

  const handleArchiveList = useCallback((listId) => {
    archiveList(listId)
  }, [archiveList])

  const handleAddCard = useCallback((listId, title) => {
    addCard(listId, title)
  }, [addCard])

  const handleEditCard = useCallback((card) => {
    setSelectedCard(card)
    setIsModalOpen(true)
  }, [])

  const handleSaveCard = useCallback((updatedCard) => {
    updateCard(updatedCard.id, {
      title: updatedCard.title,
      description: updatedCard.description,
      tags: updatedCard.tags,
    })
  }, [updateCard])

  const handleDeleteCard = useCallback((cardId) => {
    deleteCard(cardId)
  }, [deleteCard])

  return (
    <div className="flex-1 overflow-x-auto p-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 h-full">
          {visibleLists.map((list) => (
            <ListColumn
              key={list.id}
              list={list}
              cards={getListCards(list.id)}
              onRenameList={handleRenameList}
              onArchiveList={handleArchiveList}
              onAddCard={handleAddCard}
              onEditCard={handleEditCard}
              onDeleteCard={handleDeleteCard}
            />
          ))}
        </div>

        <DragOverlay>
          {activeCard ? (
            <div className="opacity-80">
              <Card card={activeCard} onEdit={() => {}} onDelete={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <Suspense fallback={<div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">Loading...</div>}>
        {isModalOpen && (
          <CardDetailModal
            card={selectedCard}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveCard}
            onDelete={handleDeleteCard}
          />
        )}
      </Suspense>
    </div>
  )
}
