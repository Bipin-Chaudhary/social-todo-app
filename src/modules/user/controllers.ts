import { Request, Response } from 'express'
import UsersModel from './model'
import bcrypt from 'bcryptjs'
import statusCode from '../../utils/statusCode'
import messages from '../../utils/responseMessages'
import { validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'

class UsersController {
  async signup (req:Request, res:Response) {
    try {
      console.log('called', req.body)
      const errors = validationResult(req)
      if (!errors.isEmpty()) return res.status(statusCode.UnprocessableEntity).json({ status: statusCode.UnprocessableEntity, errors: errors.array() })

      const { sName, sEmail, sMobile } = req.body
      let { sPassword } = req.body

      sPassword = await bcrypt.hash(sPassword, 10)

      const userExist = await UsersModel.findOne({ sEmail }).lean()
      if (userExist) return res.status(statusCode.Conflict).json({ message: messages.accountExist })

      const user = await UsersModel.create({ sName, sEmail, sMobile, sPassword })

      return res.status(statusCode.OK).json({ message: messages.userRegistered, data: user })
    } catch (error) {
      return res.status(statusCode.InternalServerError).json({
        status: statusCode.InternalServerError,
        message: messages.InternalServerError
      })
    }
  }

  async login (req:Request, res:Response) {
    try {
      console.log('called', req.body)
      const errors = validationResult(req)
      if (!errors.isEmpty()) return res.status(statusCode.UnprocessableEntity).json({ status: statusCode.UnprocessableEntity, errors: errors.array() })

      const { sEmail, sPassword } = req.body

      const userExist = await UsersModel.findOne({ sEmail }).lean()

      if (!userExist) {
        return res.status(401).json({
          message: 'Account doesnt exist'
        })
      }

      const passwordResult = await bcrypt.compare(
        sPassword,
        userExist.sPassword
      )

      if (!passwordResult) {
        return res.status(401).json({
          message: 'Invalid email or password'
        })
      }

      const token = jwt.sign(
        {
          sEmail: userExist.sEmail,
          id: userExist._id
        },
        `${process.env.JWT_KEY}`,
        {
          expiresIn: '7d'
        }
      )

      return res.status(statusCode.OK).json({ message: messages.loginSuccess, token })
    } catch (error) {
      return res.status(statusCode.InternalServerError).json({
        status: statusCode.InternalServerError,
        message: messages.InternalServerError
      })
    }
  }

  async editProfileDetails (req:Request, res:Response) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) return res.status(statusCode.UnprocessableEntity).json({ status: statusCode.UnprocessableEntity, errors: errors.array() })

      const { _id } = req.params
      const { sName, sMobile } = req.body

      const userExist = await UsersModel.findOne({ _id }).lean()
      if (!userExist) res.status(statusCode.NotFound).json({ message: messages.notFound.replace('##', 'account') })

      const user = await UsersModel.findByIdAndUpdate({ _id }, { sName, sMobile }, { new: true })

      return res.status(statusCode.OK).json({ message: messages.editedSuccessfully.replace('##', 'profile'), data: user })
    } catch (error) {
      return res.status(statusCode.InternalServerError).json({
        status: statusCode.InternalServerError,
        message: messages.InternalServerError
      })
    }
  }

  async getProfileDetails (req:Request, res:Response) {
    try {
      const { _id } = req.params

      const userExist = await UsersModel.findOne({ _id }).lean()
      if (!userExist) res.status(statusCode.NotFound).json({ message: messages.notFound.replace('##', 'account') })

      const user = await UsersModel.findOne({ _id }, { sName: 1, sMobile: 1, sProfilePic: 1, sEmail: 1 }, { new: true })

      return res.status(statusCode.OK).json({ message: messages.fetchedSuccessfully.replace('##', 'profile'), data: user })
    } catch (error) {
      return res.status(statusCode.InternalServerError).json({
        status: statusCode.InternalServerError,
        message: messages.InternalServerError
      })
    }
  }
}

export default new UsersController()
