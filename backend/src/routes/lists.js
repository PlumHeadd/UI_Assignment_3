import { Router } from 'express'
import { createList, updateList, deleteList, getAllLists } from '../controllers/listController.js'

const router = Router()

router.get('/', getAllLists)
router.post('/', createList)
router.patch('/:id', updateList)
router.delete('/:id', deleteList)

export default router
