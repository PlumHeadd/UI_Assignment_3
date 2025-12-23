import Card from '../models/Card.js'
import List from '../models/List.js'
import { generateId } from '../utils/helpers.js'

export const createCard = async (req, res) => {
  try {
    const { listId, title, ...rest } = req.body
    if (!listId || !title?.trim()) {
      return res.status(400).json({ error: 'ListId and title are required' })
    }

    // Verify list exists
    const listExists = await List.findOne({ id: listId })
    if (!listExists) {
      return res.status(400).json({ error: 'List not found' })
    }

    const cardCount = await Card.countDocuments({ listId })
    const newCard = await Card.create({
      id: rest.id || generateId(),
      listId,
      title: title.trim(),
      description: rest.description || '',
      tags: rest.tags || [],
      order: cardCount,
      version: 1,
      lastModifiedAt: Date.now(),
      ...rest,
    })

    res.status(201).json(newCard)
  } catch (error) {
    console.error('Error creating card:', error)
    res.status(400).json({ error: 'Failed to create card', details: error.message })
  }
}

export const updateCard = async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    const card = await Card.findOne({ id })
    if (!card) {
      return res.status(404).json({ error: 'Card not found' })
    }

    // If updating listId, verify new list exists
    if (updates.listId && updates.listId !== card.listId) {
      const listExists = await List.findOne({ id: updates.listId })
      if (!listExists) {
        return res.status(400).json({ error: 'Target list not found' })
      }
    }

    card.set({
      ...updates,
      version: (card.version || 1) + 1,
      lastModifiedAt: Date.now(),
    })

    await card.save()
    res.json(card)
  } catch (error) {
    console.error('Error updating card:', error)
    res.status(400).json({ error: 'Failed to update card', details: error.message })
  }
}

export const deleteCard = async (req, res) => {
  try {
    const { id } = req.params

    const card = await Card.findOne({ id })
    if (!card) {
      return res.status(404).json({ error: 'Card not found' })
    }

    await Card.deleteOne({ id })
    res.json({ success: true, message: 'Card deleted successfully' })
  } catch (error) {
    console.error('Error deleting card:', error)
    res.status(400).json({ error: 'Failed to delete card', details: error.message })
  }
}

export const moveCard = async (req, res) => {
  try {
    const { id } = req.params
    const { targetListId, targetIndex } = req.body

    if (!targetListId || targetIndex === undefined) {
      return res.status(400).json({ error: 'targetListId and targetIndex are required' })
    }

    const card = await Card.findOne({ id })
    if (!card) {
      return res.status(404).json({ error: 'Card not found' })
    }

    // Verify target list exists
    const targetList = await List.findOne({ id: targetListId })
    if (!targetList) {
      return res.status(400).json({ error: 'Target list not found' })
    }

    card.set({
      listId: targetListId,
      order: targetIndex,
      version: (card.version || 1) + 1,
      lastModifiedAt: Date.now(),
    })

    await card.save()
    res.json(card)
  } catch (error) {
    console.error('Error moving card:', error)
    res.status(400).json({ error: 'Failed to move card', details: error.message })
  }
}

export const getAllCards = async (req, res) => {
  try {
    const { listId } = req.query
    const filter = listId ? { listId } : {}
    const cards = await Card.find(filter).sort({ order: 1 }).lean()
    res.json(cards)
  } catch (error) {
    console.error('Error fetching cards:', error)
    res.status(500).json({ error: 'Failed to fetch cards', details: error.message })
  }
}