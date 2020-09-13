import mongoose from 'mongoose'

// Word Schema
const WordSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  author: { type: String, required: true },
  word: { type: String, required: true }
})

export default mongoose.models.Word || mongoose.model('Word', WordSchema)
