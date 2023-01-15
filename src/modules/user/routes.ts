import { Router } from 'express'
import { body } from 'express-validator'
import UsersController from './controllers'

const router = Router()

router.post('/signup', [
  body('sName').not().isEmpty(),
  body('sEmail').isEmail(),
  body('sMobile').not().isEmpty(),
  body('sPassword').not().isEmpty()
], UsersController.signup)

router.post('/login', [
  body('sEmail').isEmail().not().isEmpty(),
  body('sPassword').not().isEmpty()
], UsersController.login)

router.put('/edit-profile/:_id', [
  body('sName').not().isEmpty(),
  body('sMobile').not().isEmpty()
], UsersController.editProfileDetails)

router.get('/profile-details/:_id', UsersController.editProfileDetails)

export default router
