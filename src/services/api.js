let serverData = {
  lists: [],
  cards: [],
}

let shouldFail = false
let delay = 100

export function setMockDelay(ms) {
  delay = ms
}

export function setMockFailure(fail) {
  shouldFail = fail
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function simulateNetwork() {
  await wait(delay)
  if (shouldFail) {
    throw new Error('Network error')
  }
}

export async function fetchAllData() {
  await simulateNetwork()
  return {
    lists: [...serverData.lists],
    cards: [...serverData.cards],
  }
}

export async function createList(list) {
  await simulateNetwork()
  const newList = {
    ...list,
    version: 1,
    lastModifiedAt: Date.now(),
  }
  serverData.lists.push(newList)
  return newList
}

export async function updateList(listId, updates) {
  await simulateNetwork()
  const index = serverData.lists.findIndex((l) => l.id === listId)
  if (index === -1) throw new Error('List not found')

  const existing = serverData.lists[index]
  const updated = {
    ...existing,
    ...updates,
    version: existing.version + 1,
    lastModifiedAt: Date.now(),
  }
  serverData.lists[index] = updated
  return updated
}

export async function deleteList(listId) {
  await simulateNetwork()
  serverData.lists = serverData.lists.filter((l) => l.id !== listId)
  serverData.cards = serverData.cards.filter((c) => c.listId !== listId)
  return { success: true }
}

export async function createCard(card) {
  await simulateNetwork()
  const newCard = {
    ...card,
    version: 1,
    lastModifiedAt: Date.now(),
  }
  serverData.cards.push(newCard)
  return newCard
}

export async function updateCard(cardId, updates) {
  await simulateNetwork()
  const index = serverData.cards.findIndex((c) => c.id === cardId)
  if (index === -1) throw new Error('Card not found')

  const existing = serverData.cards[index]
  const updated = {
    ...existing,
    ...updates,
    version: existing.version + 1,
    lastModifiedAt: Date.now(),
  }
  serverData.cards[index] = updated
  return updated
}

export async function deleteCard(cardId) {
  await simulateNetwork()
  serverData.cards = serverData.cards.filter((c) => c.id !== cardId)
  return { success: true }
}

export async function moveCard(cardId, targetListId, targetIndex) {
  await simulateNetwork()
  const index = serverData.cards.findIndex((c) => c.id === cardId)
  if (index === -1) throw new Error('Card not found')

  const existing = serverData.cards[index]
  const updated = {
    ...existing,
    listId: targetListId,
    order: targetIndex,
    version: existing.version + 1,
    lastModifiedAt: Date.now(),
  }
  serverData.cards[index] = updated
  return updated
}

export function getServerData() {
  return serverData
}

export function setServerData(data) {
  serverData = data
}

export function resetServerData() {
  serverData = { lists: [], cards: [] }
}
