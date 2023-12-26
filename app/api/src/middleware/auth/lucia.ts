// lucia.ts
import { deriveDatabaseAdapter } from '#/api/db/d1-kysely-lucia'
import { lucia, Middleware } from 'lucia'
import 'lucia/polyfill/node'
import { web } from 'lucia/middleware'

// import { google } from '@lucia-auth/oauth/providers';
import { github } from '@lucia-auth/oauth/providers'
import {
  LUCIA_AUTH_COOKIES_OPTIONS,
  LUCIA_AUTH_COOKIES_OPTIONS_SECURE,
  LUCIA_AUTH_COOKIES_SESSION_TOKEN
} from '#/types'

export const createAuth = async (env: Env) => {
  const adapter = await deriveDatabaseAdapter(env)
  if (!adapter) {
    throw new Error('could not derive database adapter')
  }
  const auth = lucia({
    env: env.NODE_ENV === 'production' ? 'PROD' : 'DEV',
    middleware: web(),
    adapter,
    getUserAttributes: (data) => {
      console.log(
        `[api] [middleware] [auth] [lucia] [getUserAttributes] -> data: ${JSON.stringify(data)}`
      )
      return {
        userId: data.id,
        username: data.username,
        email: data.email,
        name: data.name,
        avatar_url: data.avatar_url,
        roles: []
      }
    },
    sessionCookie: {
      name: LUCIA_AUTH_COOKIES_SESSION_TOKEN,
      attributes:
        env.NODE_ENV === 'production'
          ? LUCIA_AUTH_COOKIES_OPTIONS_SECURE
          : LUCIA_AUTH_COOKIES_OPTIONS
    }
  })

  const githubAuth = github(auth, {
    clientId: env.GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET,
    redirectUri:
      env.NODE_ENV === 'development' || env.NODE_ENV === 'staging'
        ? `http://${env.HOST}:${env.VITE_PORT_API}/api/auth/login/github/callback`
        : `https://${env.HOST}/api/auth/login/github/callback`,
    // : `https://${env.HOST}/api/auth/login/github/callback`,
    scope: ['user:email, read:user']
  })

  return { auth, githubAuth }
}

export type Auth = ReturnType<typeof createAuth>
