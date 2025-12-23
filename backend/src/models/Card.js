import mongoose from 'mongoose'

const CardSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    listId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    tags: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    version: { type: Number, default: 1 },
    lastModifiedAt: { type: Number, default: () => Date.now() },
  },
  { timestamps: true }
)

export default mongoose.model('Card', CardSchema)
