import { Schema, model, Types } from 'mongoose'

const TodoSchema = new Schema(
  {
    iUser: { type: Types.ObjectId, required: true, ref: 'users' },
    sDesc: { type: String, required: true },
    bCompleted: { type: Boolean, default: false },
    dDate: { type: Date, required: true }
  },
  { timestamps: true }
)

TodoSchema.index({ iUser: -1 })

export default model('todos', TodoSchema)
