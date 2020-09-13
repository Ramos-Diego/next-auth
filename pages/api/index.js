import dbConnect from '../../utils/dbConnect'
import Word from '../../models/Word'
import jwt from 'next-auth/jwt'

const secret = process.env.JWT_SECRET

export default async (req, res) => {
  const {
    method,
    body: { _id },
  } = req
  const token = await jwt.getToken({ req, secret })

  // These API routes are protected for logged in users
  if (token) {
    await dbConnect()

    switch (method) {
      case 'GET':
        try {
          const words = await Word.find({})
          res.status(200).json(words)
        } catch (error) {
          res.status(400).json({ success: false })
        }
        break

      case 'POST':
        try {
          // Optional filter to prevent any JavaScript injection
          // Only accept letters a-z, case insensitive
          const filteredWord = req.body.word.replace(/[^a-z]/gi, '')
          const word = await Word.create({
            word: filteredWord,
            // The Word model requires these two fields
            author: token.name,
            uid: token.uid,
          }) /* create a new model in the database */
          res.status(201).json({ saved: true })
        } catch (error) {
          res.status(400).json({ saved: false })
        }
        break

      case 'DELETE' /* Delete a word */:
        try {
          const toDelete = await Word.findById(_id)
          if (toDelete.uid === token.uid) {
            const { deletedCount } = await Word.deleteOne({ _id })
            if (!deletedCount) {
              return res.status(400).json({ deletedWord: false })
            }
            res.status(200).json({ deletedWord: true })
          } else {
            res.status(401).json({ msg: `You're not authorized` })
          }
        } catch (error) {
          res.status(400).json({ success: false })
        }
        break

      default:
        res.status(400).json({ success: false })
        break
    }
  } else {
    res.status(401).json({ msg: `You're not authorized` })
  }
}
