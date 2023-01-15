import mongoose from 'mongoose'

class MongoConnect {
  connect () {
    mongoose.set('strictQuery', false)

    mongoose.connect(`${process.env.DB_URL}`, {
      readPreference: 'secondary',
      maxPoolSize: 50
    }
    ).then(() => console.log('MongoDB connected!!', process.env.DB_URL))
      .catch((err) => console.log('Failed to connect to MongoDB', err))

    mongoose.syncIndexes().then().catch()
  }
}

export default new MongoConnect()
