import { Schema, model, Types } from 'mongoose'

const PostSchema = new Schema(
  {
    iUser: { type: Types.ObjectId, required: true, ref: 'users' },
    sTitle: { type: String, required: true },
    sContent: { type: String, required: true }
  },
  { timestamps: true }
)

PostSchema.index({ iUser: -1 })

export default model('posts', PostSchema)
