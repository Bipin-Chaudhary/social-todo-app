import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import UserModel from '../modules/user/model'
import responseMessages from '../utils/responseMessages'
import statusCode from '../utils/statusCode'

type CustomRequest = Request & { userId?: string }

export default async (req:CustomRequest, res:Response, next:NextFunction) => {
  try {
    console.log('auth called')
    const token = req!.headers!.authorization!.split(' ')[1] || req!.headers!.authorization

    console.log({ token })
    if (!token) {
      return res.status(statusCode.Unauthorized).json({
        message: responseMessages.authFailed
      })
    }

    const decoded:any = jwt.verify(token as string, process.env.JWT_KEY as string)

    const userData = await UserModel.findOne({ _id: decoded.id }, { _id: 1 })

    if (!userData) {
      return res.status(statusCode.Unauthorized).json({
        message: responseMessages.authFailed
      })
    }

    req.userId = userData._id.toString()

    next()
  } catch (err) {
    return res.status(statusCode.Unauthorized).json({
      message: responseMessages.authFailed
    })
  }
}
