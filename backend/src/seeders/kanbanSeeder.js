import List from '../models/List.js'
import Card from '../models/Card.js'
import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

function generateId() {
  return uuidv4()
}

function generateSeedData() {
  const lists = [
    { id: generateId(), title: 'Backlog', archived: false, order: 0, version: 1, lastModifiedAt: Date.now() },
    { id: generateId(), title: 'Doing', archived: false, order: 1, version: 1, lastModifiedAt: Date.now() },
    { id: generateId(), title: 'Review', archived: false, order: 2, version: 1, lastModifiedAt: Date.now() },
    { id: generateId(), title: 'Done', archived: false, order: 3, version: 1, lastModifiedAt: Date.now() },
  ]

  const tags = ['bug', 'feature', 'urgent', 'low-priority', 'documentation', 'testing', 'design', 'backend', 'frontend']
  const cards = []

  for (let i = 0; i < 520; i++) {
    const listIndex = Math.floor(Math.random() * lists.length)
    const numTags = Math.floor(Math.random() * 3)
    const cardTags = []
    for (let j = 0; j < numTags; j++) {
      const tagIndex = Math.floor(Math.random() * tags.length)
      if (!cardTags.includes(tags[tagIndex])) {
        cardTags.push(tags[tagIndex])
      }
    }

    cards.push({
      id: generateId(),
      listId: lists[listIndex].id,
      title: `Performance Test Task ${i + 1}`,
      description: `This is a performance test card number ${i + 1}. It contains realistic content to test rendering performance with large datasets. Cards like this would typically contain detailed requirements, acceptance criteria, and implementation notes.`,
      tags: cardTags,
      order: i % 100,
      version: 1,
      lastModifiedAt: Date.now() - Math.random() * 86400000,
    })
  }

  return { lists, cards }
}

export async function seedKanbanData() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kanban'
    console.log('🔌 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    console.log('🗑️  Clearing existing data...')

    const db = mongoose.connection.db

    try {
      await db.dropCollection('lists')
      console.log('📋 Dropped lists collection')
    } catch (err) {
      if (err.code !== 26) {
        console.log('Lists collection did not exist or error:', err.message)
      }
    }

    try {
      await db.dropCollection('cards')
      console.log('🃏 Dropped cards collection')
    } catch (err) {
      if (err.code !== 26) {
        console.log('Cards collection did not exist or error:', err.message)
      }
    }

    console.log('📊 Generating 500+ performance test cards...')
    const { lists, cards } = generateSeedData()

    console.log('💾 Inserting data into MongoDB...')
    await Promise.all([List.insertMany(lists), Card.insertMany(cards)])

    console.log('✅ Kanban board seeded successfully!')
    console.log(`📋 Created ${lists.length} lists and ${cards.length} cards`)

    await mongoose.connection.close()
    console.log('🔌 Disconnected from MongoDB')

    return { lists: lists.length, cards: cards.length }
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    try {
      await mongoose.connection.close()
    } catch (closeErr) {
      console.error('Error closing connection:', closeErr.message)
    }
    throw error
  }
}