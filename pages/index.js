import dbConnect from '../utils/dbConnect'
import Word from '../models/Word'
import { signIn, signOut, useSession, getSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { useState } from 'react'

// This project shows how to save data from an user with
// an uid attached to be able to query based on that uid
// Only the author can see his words and delete them
// GET /api responds with all of the words from all users

// GET /api example response
// [
//   {
//     "_id": "5f5e2fc031d84402b68f6d12",
//     "word": "Pop",
//     "author": "Ramona",
//     The uid is obtained from the profile.id provided by oauth
//     The profile object changes based on the provider
//     "uid": "123",
//     "__v": 0
//   },
//   {
//     "_id": "5f5e2fc631d84402b68f6d13",
//     "word": "Woo",
//     "author": "Ramona",
//     "uid": "123",
//     "__v": 0
//   }
// ]

export default function Page({ words }) {
  const router = useRouter()
  const [session, loading] = useSession()
  const { register, handleSubmit, errors } = useForm()
  const [apiError, setApiError] = useState(false)
  // session && console.log(JSON.stringify(session.user, null, 2))

  const onSubmit = handleSubmit(async (data) => {
    fetch('http://localhost:3000/api/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then(({ saved }) => (saved ? router.reload() : setApiError(true)))
      .catch((err) => console.error(err))
  })

  // async function deleteWord(word) {
  const deleteWord = async (_id) => {
    fetch(`http://localhost:3000/api/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      // Attach uid to the req.body to ensure user
      // can't delete other user's words
      body: JSON.stringify({ _id }),
    })
      .then((response) => response.json())
      .then(({ deletedWord }) =>
        deletedWord ? router.reload() : console.log('Not deleted!')
      )
      .catch((err) => console.error(err))
  }

  return (
    <>
      {/* LOGIN and LOGOUT */}
      {session ? (
        <>
          <p>Signed in as {session.user.name}</p>
          <button onClick={signOut}>Sign out</button>
        </>
      ) : (
        <>
          <p>Not signed in</p>
          <button onClick={signIn}>Sign in</button>
        </>
      )}
      {/* SUBMIT FORM */}
      <br />
      <br />
      <form onSubmit={onSubmit}>
        <input
          name="word"
          placeholder="Enter a word"
          ref={register({ required: true })}
        />
        <button>Submit</button>
        {errors.word && <div>The word is required.</div>}
      </form>
      {apiError && <div>Sign in to submit words.</div>}
      <br />
      {/* DISPLAY DATABASE RESPONSE */}
      {words &&
        words.map(({ word, _id }, idx) => (
          <div key={idx}>
            <h3>{word}</h3>
            <button onClick={() => deleteWord(_id)}>Delete</button>
          </div>
        ))}
      <pre>{words ? JSON.stringify(words, null, 2) : 'No words.'}</pre>
    </>
  )
}

export const getServerSideProps = async (context) => {
  await dbConnect()
  const session = await getSession(context)

  if (session) {
    // Get all the words from an uid
    const data = await Word.find({ /*uid: session.user.uid*/ })
      // Return JavaScript object, not Mongoose document
      .lean()
      // Sort by _id, which increments by one on every entry
      .sort({ _id: -1 })
      // .select removes the __v from the output
      .select('-__v')

    const words = data.map((word) => {
      return {
        ...word,
        // _id is an object created by mongoose which can't be serialized. It must be converted to a string
        _id: word._id.toString(),
      }
    })

    return { props: { words } }
  } else {
    return { props: { words: null } }
  }
}
