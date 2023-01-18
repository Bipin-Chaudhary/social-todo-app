import { Request, Response } from 'express'
import mongoose from 'mongoose'
import PostModel from './model'
import statusCode from '../../utils/statusCode'
import messages from '../../utils/responseMessages'
import { validationResult } from 'express-validator'
import defaultPagination from '../../utils/defaultPagination'
import recachegoose from 'recachegoose'

type CustomRequest = Request & { userId?: string }

class PostController {
  async add (req:CustomRequest, res:Response) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) return res.status(statusCode.UnprocessableEntity).json({ status: statusCode.UnprocessableEntity, errors: errors.array() })

      const { sContent, sTitle } = req.body

      const createObj = { iUser: req.userId, sContent, sTitle }

      const post = await PostModel.create(createObj)

      recachegoose.clearCache('list-post', null)

      return res.status(statusCode.OK).json({ message: messages.addedSuccessfully.replace('##', 'post'), data: post })
    } catch (error) {
      return res.status(statusCode.InternalServerError).json({
        status: statusCode.InternalServerError,
        message: messages.InternalServerError
      })
    }
  }

  async edit (req:CustomRequest, res:Response) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) return res.status(statusCode.UnprocessableEntity).json({ status: statusCode.UnprocessableEntity, errors: errors.array() })

      const { id } = req.params
      const { sContent, sTitle } = req.body

      const updateObj = { iUser: req.userId, sContent, sTitle }

      const post = await PostModel.findOne({ _id: id, iUser: new mongoose.Types.ObjectId(req.userId) })

      if (!post) return res.status(statusCode.NotFound).json({ message: messages.notFound.replace('##', 'post') })

      const updatedPost = await PostModel.findByIdAndUpdate(id, updateObj, { new: true })

      recachegoose.clearCache(id, null)

      return res.status(statusCode.OK).json({ message: messages.editedSuccessfully.replace('##', 'post'), data: updatedPost })
    } catch (error) {
      return res.status(statusCode.InternalServerError).json({
        status: statusCode.InternalServerError,
        message: messages.InternalServerError
      })
    }
  }

  async delete (req:CustomRequest, res:Response) {
    try {
      const { id } = req.params

      const post = await PostModel.findOne({ _id: id, iUser: new mongoose.Types.ObjectId(req.userId) })

      if (!post) return res.status(statusCode.NotFound).json({ message: messages.notFound.replace('##', 'post') })

      await PostModel.deleteOne({ _id: id })

      recachegoose.clearCache('list-post', null)

      return res.status(statusCode.OK).json({ message: messages.deletedSuccessfully.replace('##', 'post'), data: null })
    } catch (error) {
      return res.status(statusCode.InternalServerError).json({
        status: statusCode.InternalServerError,
        message: messages.InternalServerError
      })
    }
  }

  async details (req:CustomRequest, res:Response) {
    try {
      const { id } = req.params

      // @ts-ignore
      const post = await PostModel.findOne({ _id: id, iUser: new mongoose.Types.ObjectId(req.userId) }).cache(process.env.CACHE_LIMIT, id)

      if (!post) return res.status(statusCode.NotFound).json({ message: messages.notFound.replace('##', 'post') })

      return res.status(statusCode.OK).json({ message: messages.fetchedSuccessfully.replace('##', 'post'), data: post })
    } catch (error) {
      return res.status(statusCode.InternalServerError).json({
        status: statusCode.InternalServerError,
        message: messages.InternalServerError
      })
    }
  }

  async list (req:CustomRequest, res:Response) {
    try {
      const { limit, skip } = defaultPagination(req.query)

      const query = { iUser: new mongoose.Types.ObjectId(req.userId) }

      // @ts-ignore
      const post = await PostModel.find(query).cache(process.env.CACHE_LIMIT, 'list-post')
        .skip(skip)
        .limit(limit)
        .lean()

      const total = await PostModel.countDocuments(query)

      return res.status(statusCode.OK).json({ message: messages.fetchedSuccessfully.replace('##', 'post'), data: { docs: post, total } })
    } catch (error) {
      return res.status(statusCode.InternalServerError).json({
        status: statusCode.InternalServerError,
        message: messages.InternalServerError
      })
    }
  }

  async listPublicPosts (req:CustomRequest, res:Response) {
    try {
      const { limit, skip } = defaultPagination(req.query)

      const { id } = req.params // user id

      const query = { iUser: new mongoose.Types.ObjectId(id) }

      // @ts-ignore
      const posts = await PostModel.find(query).cache(process.env.CACHE_LIMIT, 'list-post')
        .skip(skip)
        .limit(limit)
        .lean()

      const total = await PostModel.countDocuments(query)

      return res.status(statusCode.OK).json({ message: messages.fetchedSuccessfully.replace('##', 'post'), data: { docs: posts, total } })
    } catch (error) {
      return res.status(statusCode.InternalServerError).json({
        status: statusCode.InternalServerError,
        message: messages.InternalServerError
      })
    }
  }
}

export default new PostController()
