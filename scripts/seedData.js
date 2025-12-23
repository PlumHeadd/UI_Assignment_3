const STORAGE_KEY = 'kanban-board-data'

function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
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

function seedLocalStorage() {
  try {
    const data = generateSeedData()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    console.log(`✅ Successfully seeded ${data.lists.length} lists and ${data.cards.length} cards for performance testing`)
    console.log('🔄 Refresh the page to see the seeded data')
    return data
  } catch (error) {
    console.error('❌ Failed to seed data:', error)
    return null
  }
}

if (typeof window !== 'undefined') {
  window.seedKanbanData = seedLocalStorage
  console.log('🎯 Performance testing ready! Run: seedKanbanData()')
  console.log('📊 This will create 520 cards across 4 lists for performance profiling')
}

export { generateSeedData, seedLocalStorage }
