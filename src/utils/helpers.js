import { v4 as uuidv4 } from 'uuid'

export function generateId() {
  return uuidv4()
}

export function reorderArray(arr, fromIndex, toIndex) {
  const result = Array.from(arr)
  const [removed] = result.splice(fromIndex, 1)
  result.splice(toIndex, 0, removed)
  return result
}

export function moveItemBetweenArrays(source, destination, sourceIndex, destIndex) {
  const sourceClone = Array.from(source)
  const destClone = Array.from(destination)
  const [removed] = sourceClone.splice(sourceIndex, 1)
  destClone.splice(destIndex, 0, removed)
  return { source: sourceClone, destination: destClone }
}

export function threeWayMerge(base, local, server) {
  if (JSON.stringify(base) === JSON.stringify(local)) {
    return { merged: server, conflict: false }
  }
  if (JSON.stringify(base) === JSON.stringify(server)) {
    return { merged: local, conflict: false }
  }
  if (JSON.stringify(local) === JSON.stringify(server)) {
    return { merged: local, conflict: false }
  }

  const merged = { ...server }
  let conflict = false

  for (const key of Object.keys(local)) {
    if (key === 'version' || key === 'lastModifiedAt') continue

    const baseVal = base[key]
    const localVal = local[key]
    const serverVal = server[key]

    if (JSON.stringify(baseVal) !== JSON.stringify(localVal)) {
      if (JSON.stringify(baseVal) !== JSON.stringify(serverVal)) {
        conflict = true
      } else {
        merged[key] = localVal
      }
    }
  }

  return { merged, conflict }
}
