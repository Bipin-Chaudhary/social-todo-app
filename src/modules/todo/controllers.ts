import { Request, Response } from 'express'
import mongoose from 'mongoose'
import TodoModel from './model'
import statusCode from '../../utils/statusCode'
import messages from '../../utils/responseMessages'
import { validationResult } from 'express-validator'
import defaultPagination from '../../utils/defaultPagination'
import recachegoose from 'recachegoose'

type CustomRequest = Request & { userId?: string }

class TodoController {
  async add (req:CustomRequest, res:Response) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) return res.status(statusCode.UnprocessableEntity).json({ status: statusCode.UnprocessableEntity, errors: errors.array() })

      const { sDesc, dDate } = req.body

      const createObj = { iUser: req.userId, sDesc, dDate }

      const todo = await TodoModel.create(createObj)

      recachegoose.clearCache('list-todo', null)

      return res.status(statusCode.OK).json({ message: messages.addedSuccessfully.replace('##', 'todo'), data: todo })
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
      const { sDesc, dDate } = req.body

      const todo = await TodoModel.findOne({ _id: id, iUser: new mongoose.Types.ObjectId(req.userId) }).lean()

      if (!todo) return res.status(statusCode.NotFound).json({ message: messages.notFound.replace('##', 'todo') })

      const updateObj = { sDesc, dDate }

      const updatedTodo = await TodoModel.findByIdAndUpdate(id, updateObj, { new: true })

      recachegoose.clearCache('list-todo', null)

      return res.status(statusCode.OK).json({ message: messages.editedSuccessfully.replace('##', 'todo'), data: updatedTodo })
    } catch (error) {
      return res.status(statusCode.InternalServerError).json({
        status: statusCode.InternalServerError,
        message: messages.InternalServerError
      })
    }
  }

  async markComplete (req:CustomRequest, res:Response) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) return res.status(statusCode.UnprocessableEntity).json({ status: statusCode.UnprocessableEntity, errors: errors.array() })

      const { id } = req.params
      const { bCompleted } = req.body

      const todo = await TodoModel.findOne({ _id: id, iUser: new mongoose.Types.ObjectId(req.userId) }).lean()

      if (!todo) return res.status(statusCode.NotFound).json({ message: messages.notFound.replace('##', 'todo') })

      const updateObj = { bCompleted }

      const updatedTodo = await TodoModel.findByIdAndUpdate(id, updateObj, { new: true })

      recachegoose.clearCache('list-todo', null)

      return res.status(statusCode.OK).json({ message: messages.editedSuccessfully.replace('##', 'todo'), data: updatedTodo })
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

      const todo = await TodoModel.findOne({ _id: id, iUser: new mongoose.Types.ObjectId(req.userId) }).lean()

      if (!todo) return res.status(statusCode.NotFound).json({ message: messages.notFound.replace('##', 'todo') })

      await TodoModel.deleteOne({ _id: id })

      recachegoose.clearCache('list-todo', null)

      return res.status(statusCode.OK).json({ message: messages.deletedSuccessfully.replace('##', 'todo'), data: null })
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
      const todo = await TodoModel.findOne({ _id: id, iUser: new mongoose.Types.ObjectId(req.userId) }).cache(process.env.CACHE_LIMIT, id).lean()

      if (!todo) return res.status(statusCode.NotFound).json({ message: messages.notFound.replace('##', 'todo') })

      return res.status(statusCode.OK).json({ message: messages.fetchedSuccessfully.replace('##', 'todo'), data: todo })
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
      const todos = await TodoModel.find(query).cache(process.env.CACHE_LIMIT, 'list-todo')
        .skip(skip)
        .limit(limit)
        .lean()

      const total = await TodoModel.countDocuments(query)

      return res.status(statusCode.OK).json({ message: messages.fetchedSuccessfully.replace('##', 'todo'), data: { docs: todos, total } })
    } catch (error) {
      return res.status(statusCode.InternalServerError).json({
        status: statusCode.InternalServerError,
        message: messages.InternalServerError
      })
    }
  }

  async listPublicTodos (req:CustomRequest, res:Response) {
    try {
      const { limit, skip } = defaultPagination(req.query)

      const { id } = req.params // user id

      const query = { iUser: new mongoose.Types.ObjectId(id) }

      // @ts-ignore
      const todos = await TodoModel.find(query).cache(process.env.CACHE_LIMIT, 'list-todo')
        .skip(skip)
        .limit(limit)
        .lean()

      const total = await TodoModel.countDocuments(query)

      return res.status(statusCode.OK).json({ message: messages.fetchedSuccessfully.replace('##', 'todo'), data: { docs: todos, total } })
    } catch (error) {
      return res.status(statusCode.InternalServerError).json({
        status: statusCode.InternalServerError,
        message: messages.InternalServerError
      })
    }
  }
}

export default new TodoController()
