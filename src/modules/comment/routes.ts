import { Router } from 'express'
import { body } from 'express-validator'
import CommentController from './controllers'
import authCheck from '../../middleware/authCheck'

const router = Router()

router.post('/:id', authCheck, [
  body('sContent').not().isEmpty()
], CommentController.add)

router.put('/:id', authCheck, [
  body('sContent').not().isEmpty()
], CommentController.edit)

router.delete('/:id', authCheck, CommentController.delete)

// public apis
router.get('/post/list/:id', authCheck, CommentController.listPublicPostComments)

export default router
