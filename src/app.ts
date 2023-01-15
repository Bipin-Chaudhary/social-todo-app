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

// APIs
app.use('/api/user', UserRoutes)
app.use('/api/todo', TodoRoutes)

// default route
app.all('*', (req, res, next) => {
  return res.status(statusCode.Forbidden).json({
    status: statusCode.Forbidden,
    message: responseMessages.invalidPath
  })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => { console.log(`server is running on port ${PORT}`) })
