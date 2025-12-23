import List from '../models/List.js'
import Card from '../models/Card.js'

export const getAllData = async (req, res) => {
  try {
    const [lists, cards] = await Promise.all([
      List.find().sort({ order: 1 }).lean(),
      Card.find().sort({ order: 1 }).lean(),
    ])
    res.json({ lists, cards })
  } catch (error) {
    console.error('Error fetching board data:', error)
    res.status(500).json({ error: 'Failed to fetch board data', details: error.message })
  }
}

export const resetBoard = async (req, res) => {
  try {
    await Promise.all([List.deleteMany({}), Card.deleteMany({})])
    res.json({ success: true, message: 'Board reset successfully' })
  } catch (error) {
    console.error('Error resetting board:', error)
    res.status(500).json({ error: 'Failed to reset board', details: error.message })
  }
}