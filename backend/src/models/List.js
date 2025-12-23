import mongoose from 'mongoose'

const ListSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    archived: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    version: { type: Number, default: 1 },
    lastModifiedAt: { type: Number, default: () => Date.now() },
  },
  { timestamps: true }
)

export default mongoose.model('List', ListSchema)
