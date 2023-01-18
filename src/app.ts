import express, { Application, Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser'
import MongoConnect from './config/mongodb'
import responseMessages from './utils/responseMessages'
import statusCode from './utils/statusCode'
// routes
import UserRoutes from './modules/user/routes'
import TodoRoutes from './modules/todo/routes'
import PostRoutes from './modules/post/routes'
import CommentRoutes from './modules/comment/routes'
import recachegoose from 'recachegoose'
import mongoose from 'mongoose'

dotenv.config()

const app:Application = express()
// mongodb connect
MongoConnect.connect()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/', (req:Request, res:Response, next:NextFunction) => {
  res.send('welcome to social todo app')
})

// caching with redis
recachegoose(mongoose, {
  engine: 'redis',
  port: 10060,
  host: 'redis-10060.c245.us-east-1-3.ec2.cloud.redislabs.com',
  password: 'fzRhniTcn4Lcmi4AaaVfSgKgcmHZogoY'
})

// APIs
app.use('/api/user', UserRoutes)
app.use('/api/todo', TodoRoutes)
app.use('/api/post', PostRoutes)
app.use('/api/comment', CommentRoutes)

// default route
app.all('*', (req, res, next) => {
  return res.status(statusCode.Forbidden).json({
    status: statusCode.Forbidden,
    message: responseMessages.invalidPath
  })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => { console.log(`server is running on port ${PORT}`) })
