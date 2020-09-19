Next-Auth.js significantlly simplifies using OAuth. It is trully plug and play.

This project servers as a starting point/guide to implement OAuth authentication and protected routes with Next-Auth.js and Next.js.  

## Useful links

[Creating OAuth app with Github](https://docs.github.com/en/developers/apps/creating-an-oauth-app)

[Google OAuth](https://developers.google.com/identity/protocols/oauth2)

[Next-Auth.js Example](https://next-auth.js.org/getting-started/example)

Your Homepage URL will be: http://localhost:3000/
Your Authorization callback URL will be : http://localhost:3000/api/auth/
This callback URL is setup by Next-Auth automatically.

## Required environment variables

```
GITHUB_ID=
GITHUB_SECRET=
GOOGLE_ID=
GOOGLE_SECRET=
NEXTAUTH_URL=http://localhost:3000
JWT_SECRET=
MONGODB_URI=
```

## Run

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
