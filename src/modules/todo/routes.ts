import { Router } from 'express'
import { body } from 'express-validator'
import TodoController from './controllers'
import authCheck from '../../middleware/authCheck'

const router = Router()

router.post('/', authCheck, [
  body('sDesc').not().isEmpty(),
  body('dDate').not().isEmpty()
], TodoController.add)

router.put('/:id', authCheck, [
  body('sDesc').not().isEmpty(),
  body('dDate').not().isEmpty()
], TodoController.edit)

router.put('/mark-complete/:id', authCheck, [
  body('bCompleted').not().isEmpty()
], TodoController.markComplete)

router.delete('/:id', authCheck, TodoController.delete)

router.get('/:id', authCheck, TodoController.details)

router.get('/user/list', authCheck, TodoController.list)

// public apis
router.get('/user/list/public/:id', TodoController.listPublicTodos)

export default router
