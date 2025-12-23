import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import { errorHandler, notFound, requestLogger } from './middlewares/index.js'
import { seedKanbanData } from './seeders/kanbanSeeder.js'
import boardRoutes from './routes/board.js'
import listRoutes from './routes/lists.js'
import cardRoutes from './routes/cards.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kanban'
const NODE_ENV = process.env.NODE_ENV || 'development'

// Middlewares
app.use(cors({ origin: true }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
if (NODE_ENV === 'development') {
  app.use(requestLogger)
}

// Health check
app.get('/health', (req, res) => 
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV
  })
)

// Routes
app.use('/api/board', boardRoutes)
app.use('/api/lists', listRoutes)
app.use('/api/cards', cardRoutes)

// Seed route
app.post('/api/seed', async (req, res) => {
  try {
    const result = await seedKanbanData()
    res.json({ success: true, seeded: result })
  } catch (error) {
    res.status(500).json({ error: 'Seeding failed', details: error.message })
  }
})

// Error handling
app.use(notFound)
app.use(errorHandler)

// Database connection and server start
mongoose.set('strictQuery', true)
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully')
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} (${NODE_ENV})`)
      console.log(`📊 Health check: http://localhost:${PORT}/health`)
      if (NODE_ENV === 'development') {
        console.log(`🌱 Seed endpoint: POST http://localhost:${PORT}/api/seed`)
      }
    })
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message)
    process.exit(1)
  })
