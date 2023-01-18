import { Router } from 'express'
import { body } from 'express-validator'
import UsersController from './controllers'
import authCheck from '../../middleware/authCheck'
import permissionCheck from '../../middleware/permissionCheck'
import { requiresAuth } from 'express-openid-connect'

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

router.put('/edit-profile', authCheck, [
  body('sName').not().isEmpty(),
  body('sMobile').not().isEmpty()
], UsersController.editProfileDetails)

router.get('/profile', authCheck, UsersController.getProfileDetails)

// public Apis
router.get('/public/profile/:id', UsersController.getPublicProfileDetails)

router.get('/list-public-users', UsersController.listPublicUsers)

// edit other users / admin role required with edit:users permission
router.put('/edit-other/:id', body('sName').not().isEmpty(), permissionCheck(['edit:users']), authCheck, UsersController.editOtherUser)

export default router
