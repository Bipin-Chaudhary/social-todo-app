import { Router } from 'express'
import { body } from 'express-validator'
import PostController from './controllers'
import authCheck from '../../middleware/authCheck'

const router = Router()

router.post('/', authCheck, [
  body('sContent').not().isEmpty(),
  body('sTitle').not().isEmpty()
], PostController.add)

router.put('/:id', authCheck, [
  body('sContent').not().isEmpty(),
  body('sTitle').not().isEmpty()
], PostController.edit)

router.delete('/:id', authCheck, PostController.delete)

router.get('/:id', authCheck, PostController.details)

router.get('/user/list', authCheck, PostController.list)

// public apis
router.get('/user/list/public/:id', authCheck, PostController.listPublicPosts)

export default router
