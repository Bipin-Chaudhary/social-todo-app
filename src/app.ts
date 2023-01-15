import express, { Application, Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser'
import MongoConnect from './config/mongodb'

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

const PORT = process.env.PORT || 3000
app.listen(PORT, () => { console.log(`server is running on port ${PORT}`) })
