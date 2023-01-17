import { Schema, model } from 'mongoose'

const UsersSchema = new Schema(
  {
    sName: { type: String, required: true },
    sEmail: { type: String, required: true },
    sPassword: { type: String, required: true }
  },
  { timestamps: true }
)

UsersSchema.index({ sEmail: -1 }, { unique: true })

export default model('users', UsersSchema)
