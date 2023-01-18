import { Request, Response } from 'express'
import UsersModel from './model'
import bcrypt from 'bcryptjs'
import statusCode from '../../utils/statusCode'
import responseMessages from '../../utils/responseMessages'
import { validationResult } from 'express-validator'
import defaultPagination from '../../utils/defaultPagination'
import jwt from 'jsonwebtoken'
import recachegoose from 'recachegoose'

type CustomRequest = Request & { userId?: string }

type Query = {
  [key: string]: any
};

class UsersController {
  async signup (req:Request, res:Response) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) return res.status(statusCode.UnprocessableEntity).json({ status: statusCode.UnprocessableEntity, errors: errors.array() })

      const { sName, sEmail, sMobile } = req.body
      let { sPassword } = req.body

      sPassword = await bcrypt.hash(sPassword, 10)

      const userExist = await UsersModel.findOne({ sEmail }).lean()
      if (userExist) return res.status(statusCode.Conflict).json({ message: responseMessages.accountExist })

      const user = await UsersModel.create({ sName, sEmail, sMobile, sPassword })

      recachegoose.clearCache('list-public-users', null)

      return res.status(statusCode.OK).json({ message: responseMessages.userRegistered, data: user })
    } catch (error) {
      return res.status(statusCode.InternalServerError).json({
        status: statusCode.InternalServerError,
        message: responseMessages.InternalServerError
      })
    }
  }

  async login (req:Request, res:Response) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) return res.status(statusCode.UnprocessableEntity).json({ status: statusCode.UnprocessableEntity, errors: errors.array() })

      const { sEmail, sPassword } = req.body

      const userExist = await UsersModel.findOne({ sEmail }).lean()

      if (!userExist) {
        return res.status(401).json({
          message: responseMessages.accountNotExist
        })
      }

      const passwordResult = await bcrypt.compare(
        sPassword,
        userExist.sPassword
      )

      if (!passwordResult) {
        return res.status(401).json({
          message: responseMessages.invalidCredentials
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

      return res.status(statusCode.OK).json({ message: responseMessages.loginSuccess, token })
    } catch (error) {
      return res.status(statusCode.InternalServerError).json({
        status: statusCode.InternalServerError,
        message: responseMessages.InternalServerError
      })
    }
  }

  async editProfileDetails (req:CustomRequest, res:Response) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) return res.status(statusCode.UnprocessableEntity).json({ status: statusCode.UnprocessableEntity, errors: errors.array() })

      const { sName, sMobile } = req.body

      const userExist = await UsersModel.findOne({ _id: req.userId }).lean()

      if (!userExist) res.status(statusCode.NotFound).json({ message: responseMessages.notFound.replace('##', 'account') })

      const user = await UsersModel.findByIdAndUpdate({ _id: req.userId }, { sName, sMobile }, { new: true })

      recachegoose.clearCache(req.userId, null)

      return res.status(statusCode.OK).json({ message: responseMessages.editedSuccessfully.replace('##', 'profile'), data: user })
    } catch (error) {
      return res.status(statusCode.InternalServerError).json({
        status: statusCode.InternalServerError,
        message: responseMessages.InternalServerError
      })
    }
  }

  async getProfileDetails (req:CustomRequest, res:Response) {
    try {
      // @ts-ignore
      const user = await UsersModel.findOne({ _id: req.userId }, { sName: 1, sMobile: 1, sEmail: 1 }).cache(process.env.CACHE_LIMIT, req.userId)

      if (!user) res.status(statusCode.NotFound).json({ message: responseMessages.notFound.replace('##', 'account') })

      return res.status(statusCode.OK).json({ message: responseMessages.fetchedSuccessfully.replace('##', 'profile'), data: user })
    } catch (error) {
      return res.status(statusCode.InternalServerError).json({
        status: statusCode.InternalServerError,
        message: responseMessages.InternalServerError
      })
    }
  }

  async getPublicProfileDetails (req:Request, res:Response) {
    try {
      const { id } = req.params // user id

      // @ts-ignore
      const user = await UsersModel.findOne({ _id: id }, { sName: 1, sEmail: 1, sPhone: 1 }).cache(process.env.CACHE_LIMIT, id)

      if (!user) res.status(statusCode.NotFound).json({ message: responseMessages.notFound.replace('##', 'account') })

      return res.status(statusCode.OK).json({ message: responseMessages.fetchedSuccessfully.replace('##', 'profile'), data: user })
    } catch (error) {
      return res.status(statusCode.InternalServerError).json({
        status: statusCode.InternalServerError,
        message: responseMessages.InternalServerError
      })
    }
  }

  async listPublicUsers (req:CustomRequest, res:Response) {
    try {
      const { limit, skip, search } = defaultPagination(req.query)

      const query:Query = {}

      if (search) query.$or = [{ sName: search }, { sEmail: search }]

      // @ts-ignore
      const users = await UsersModel.find(query, { sName: 1, sEmail: 1, sMobile: 1 }).cache(process.env.CACHE_LIMIT, 'list-public-users')
        .skip(skip)
        .limit(limit)
        .lean()

      const total = await UsersModel.countDocuments(query)

      return res.status(statusCode.OK).json({ message: responseMessages.fetchedSuccessfully.replace('##', 'users'), data: { docs: users, total } })
    } catch (error) {
      return res.status(statusCode.InternalServerError).json({
        status: statusCode.InternalServerError,
        message: responseMessages.InternalServerError
      })
    }
  }

  async editOtherUser (req:CustomRequest, res:Response) {
    try {
      const { id } = req.params // user id
      const { sName } = req.body

      const user = await UsersModel.findOne({ _id: id }, { _id: 1 }).lean()
      if (!user) res.status(statusCode.NotFound).json({ message: responseMessages.notFound.replace('##', 'user') })

      await UsersModel.updateOne({ _id: id }, { sName })

      return res.status(statusCode.OK).json({ message: responseMessages.editedSuccessfully.replace('##', 'users') })
    } catch (error) {
      return res.status(statusCode.InternalServerError).json({
        status: statusCode.InternalServerError,
        message: responseMessages.InternalServerError
      })
    }
  }
}

export default new UsersController()
