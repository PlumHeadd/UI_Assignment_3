import List from '../models/List.js'
import Card from '../models/Card.js'
import { generateId } from '../utils/helpers.js'

export const createList = async (req, res) => {
  try {
    const { title, ...rest } = req.body
    if (!title?.trim()) {
      return res.status(400).json({ error: 'Title is required' })
    }

    const listCount = await List.countDocuments()
    const newList = await List.create({
      id: rest.id || generateId(),
      title: title.trim(),
      order: listCount,
      version: 1,
      lastModifiedAt: Date.now(),
      ...rest,
    })

    res.status(201).json(newList)
  } catch (error) {
    console.error('Error creating list:', error)
    res.status(400).json({ error: 'Failed to create list', details: error.message })
  }
}

export const updateList = async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    const list = await List.findOne({ id })
    if (!list) {
      return res.status(404).json({ error: 'List not found' })
    }

    list.set({
      ...updates,
      version: (list.version || 1) + 1,
      lastModifiedAt: Date.now(),
    })

    await list.save()
    res.json(list)
  } catch (error) {
    console.error('Error updating list:', error)
    res.status(400).json({ error: 'Failed to update list', details: error.message })
  }
}

export const deleteList = async (req, res) => {
  try {
    const { id } = req.params

    const list = await List.findOne({ id })
    if (!list) {
      return res.status(404).json({ error: 'List not found' })
    }

    // Delete list and all associated cards
    await Promise.all([List.deleteOne({ id }), Card.deleteMany({ listId: id })])

    res.json({ success: true, message: 'List and associated cards deleted successfully' })
  } catch (error) {
    console.error('Error deleting list:', error)
    res.status(400).json({ error: 'Failed to delete list', details: error.message })
  }
}

export const getAllLists = async (req, res) => {
  try {
    const lists = await List.find().sort({ order: 1 }).lean()
    res.json(lists)
  } catch (error) {
    console.error('Error fetching lists:', error)
    res.status(500).json({ error: 'Failed to fetch lists', details: error.message })
  }
}