import express, { Application, Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser'
import MongoConnect from './config/mongodb'
import responseMessages from './utils/responseMessages'
import statusCode from './utils/statusCode'
import { auth, requiresAuth } from 'express-openid-connect'

// routes
import UserRoutes from './modules/user/routes'
import TodoRoutes from './modules/todo/routes'
import PostRoutes from './modules/post/routes'
import CommentRoutes from './modules/comment/routes'

dotenv.config()

const app:Application = express()
// mongodb connect
MongoConnect.connect()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// auth0 authentication
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  clientSecret: 'efZyrMrIgE7HhpGxH5M6cpCA5aEoRzVMqouHVBBMtEC-VDn-8wDRXuLNfljsqGx8',
  authorizationParams: {
    response_type: 'code id_token'
  }
}

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config))

app.get('/', (req, res) => {
  res.send(`welcome to social todo app -->  ${req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out'}`)
})

// app.get('/admin', permissionCheck(['edit:users']), (req, res) => {
//   res.send('you are admin')
// })

app.get('/test', requiresAuth(), (req:Request, res:Response, next:NextFunction) => {
  res.send('welcome to social todo app')
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
