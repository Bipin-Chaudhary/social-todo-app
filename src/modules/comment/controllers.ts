import { Request, Response } from 'express'
import mongoose from 'mongoose'
import CommentModel from './model'
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

      const { id } = req.params // post id
      const { sContent } = req.body

      const createObj = { iUser: req.userId, sContent, iPost: id }

      const comment = await CommentModel.create(createObj)

      recachegoose.clearCache('list-comments', null)

      return res.status(statusCode.OK).json({ message: messages.addedSuccessfully.replace('##', 'comment'), data: comment })
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

      const { id } = req.params // comment id
      const { sContent } = req.body

      const updateObj = { sContent }

      const comment = await CommentModel.findOne({ _id: id, iUser: new mongoose.Types.ObjectId(req.userId) })

      if (!comment) return res.status(statusCode.NotFound).json({ message: messages.notFound.replace('##', 'post') })

      const updatedComment = await CommentModel.findByIdAndUpdate(id, updateObj, { new: true })

      recachegoose.clearCache('list-comments', null)

      return res.status(statusCode.OK).json({ message: messages.editedSuccessfully.replace('##', 'comment'), data: updatedComment })
    } catch (error) {
      return res.status(statusCode.InternalServerError).json({
        status: statusCode.InternalServerError,
        message: messages.InternalServerError
      })
    }
  }

  async delete (req:CustomRequest, res:Response) {
    try {
      const { id } = req.params // comment id

      const comment = await CommentModel.findOne({ _id: id, iUser: new mongoose.Types.ObjectId(req.userId) })

      if (!comment) return res.status(statusCode.NotFound).json({ message: messages.notFound.replace('##', 'comment') })

      await CommentModel.deleteOne({ _id: id })

      recachegoose.clearCache('list-comments', null)

      return res.status(statusCode.OK).json({ message: messages.deletedSuccessfully.replace('##', 'comment'), data: null })
    } catch (error) {
      return res.status(statusCode.InternalServerError).json({
        status: statusCode.InternalServerError,
        message: messages.InternalServerError
      })
    }
  }

  // public
  async listPublicPostComments (req:CustomRequest, res:Response) {
    try {
      const { id } = req.params // post id
      const { limit, skip } = defaultPagination(req.query)

      const query = { iPost: new mongoose.Types.ObjectId(id) }

      // @ts-ignore
      const comments = await CommentModel.find(query).cache(process.env.CACHE_LIMIT, 'list-comments')
        .skip(skip)
        .limit(limit)
        .lean()

      const total = await CommentModel.countDocuments(query)

      return res.status(statusCode.OK).json({ message: messages.fetchedSuccessfully.replace('##', 'comment'), data: { docs: comments, total } })
    } catch (error) {
      return res.status(statusCode.InternalServerError).json({
        status: statusCode.InternalServerError,
        message: messages.InternalServerError
      })
    }
  }
}

export default new PostController()
