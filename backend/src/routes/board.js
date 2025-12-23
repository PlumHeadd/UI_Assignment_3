import { Router } from 'express'
import { getAllData, resetBoard } from '../controllers/boardController.js'

const router = Router()

router.get('/', getAllData)
router.delete('/reset', resetBoard)

export default router
