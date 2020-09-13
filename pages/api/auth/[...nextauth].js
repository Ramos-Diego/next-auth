import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

const options = {
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      // scope: "user public_repo"
    }),
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorizationUrl:
        'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code',
    }),
  ],
  jwt: {
    // A secret to use for key generation - you should set this explicitly
    secret: process.env.JWT_SECRET,
  },
  callbacks: {
    session: async (session, user, sessionToken) => {
      // The user object gets the uid from the token object in JWT callback
      session.user.uid = user.uid // Add property to session
      return Promise.resolve(session)
    },
    jwt: async (token, user, account, profile, isNewUser) => {
      // Attach the profile information provided to the JWT token
      // https://github.com/nextauthjs/next-auth/issues/649
      if (!token.uid) token.uid = profile.id
      // You may log token and profile from here to see what 
      // data is available to you from the oauth provider.
      return Promise.resolve(token)
    },
  },
}

export default (req, res) => NextAuth(req, res, options)
