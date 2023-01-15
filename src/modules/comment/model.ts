import { Schema, model, Types } from 'mongoose'

const CommentSchema = new Schema(
  {
    iUser: { type: Types.ObjectId, required: true, ref: 'users' },
    iPost: { type: Types.ObjectId, required: true, ref: 'posts' },
    sContent: { type: String, required: true }
  },
  { timestamps: true }
)

CommentSchema.index({ iUser: -1 })
CommentSchema.index({ iPost: -1 })

export default model('comments', CommentSchema)
