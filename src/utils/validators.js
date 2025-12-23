export function validateCard(card) {
  const errors = []

  if (!card.title || card.title.trim() === '') {
    errors.push('Title is required')
  }

  if (card.title && card.title.length > 200) {
    errors.push('Title must be less than 200 characters')
  }

  if (card.description && card.description.length > 2000) {
    errors.push('Description must be less than 2000 characters')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function validateList(list) {
  const errors = []

  if (!list.title || list.title.trim() === '') {
    errors.push('List title is required')
  }

  if (list.title && list.title.length > 100) {
    errors.push('List title must be less than 100 characters')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
