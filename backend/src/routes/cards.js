import { Router } from 'express'
import { createCard, updateCard, deleteCard, moveCard, getAllCards } from '../controllers/cardController.js'

const router = Router()

router.get('/', getAllCards)
router.post('/', createCard)
router.patch('/:id', updateCard)
router.delete('/:id', deleteCard)
router.post('/:id/move', moveCard)

export default router
