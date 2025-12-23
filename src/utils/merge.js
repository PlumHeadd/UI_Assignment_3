/**
 * Three-way merge utility for conflict resolution
 * Compares base, local, and server versions to intelligently merge changes
 */

export function threeWayMerge(base, local, server) {
  // If no base version exists, it's a new item
  if (!base) {
    return server.lastModifiedAt > local.lastModifiedAt ? server : local
  }

  // If server and local are identical, no conflict
  if (JSON.stringify(local) === JSON.stringify(server)) {
    return { merged: local, hasConflict: false }
  }

  const conflicts = []
  const merged = { ...local }

  // Check each field for conflicts
  for (const key of Object.keys(local)) {
    if (key === 'lastModifiedAt' || key === 'version') continue

    const baseValue = base[key]
    const localValue = local[key]
    const serverValue = server[key]

    // Both changed the same field differently
    if (localValue !== baseValue && serverValue !== baseValue && localValue !== serverValue) {
      conflicts.push({
        field: key,
        base: baseValue,
        local: localValue,
        server: serverValue,
      })
      
      // For drag-and-drop fields (listId, order), prefer local changes (user intent)
      // For other fields, prefer newer timestamp
      if (key === 'listId' || key === 'order') {
        merged[key] = localValue // User explicitly moved the card
      } else {
        merged[key] = server.lastModifiedAt > local.lastModifiedAt ? serverValue : localValue
      }
    }
    // Only server changed
    else if (serverValue !== baseValue && localValue === baseValue) {
      merged[key] = serverValue
    }
    // Only local changed (keep local)
    else if (localValue !== baseValue && serverValue === baseValue) {
      merged[key] = localValue
    }
  }

  return {
    merged,
    hasConflict: conflicts.length > 0,
    conflicts,
  }
}

export function mergeCards(baseCard, localCard, serverCard) {
  return threeWayMerge(baseCard, localCard, serverCard)
}

export function mergeLists(baseList, localList, serverList) {
  return threeWayMerge(baseList, localList, serverList)
}
