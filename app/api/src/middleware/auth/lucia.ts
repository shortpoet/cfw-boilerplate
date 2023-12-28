// lucia.ts
import { lucia, Middleware, SessionSchema } from 'lucia'
import 'lucia/polyfill/node'
import { web } from 'lucia/middleware'
// import { google } from '@lucia-auth/oauth/providers';
import { github } from '@lucia-auth/oauth/providers'

import { deriveDatabaseAdapter, q } from '#/api/db/d1-kysely-lucia'

import {
  LUCIA_AUTH_COOKIES_OPTIONS,
  LUCIA_AUTH_COOKIES_OPTIONS_SECURE,
  LUCIA_AUTH_COOKIES_SESSION_TOKEN,
  User,
  UserRole,
  UserType
} from '#/types'
import { roleFlagsToArray, userTypeFlagsToArray } from '#/utils'
import { castIntToBool } from '#/api/db/d1-kysely-authjs/cast'

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
        email_verified: castIntToBool(data.email_verified),
        name: data.name,
        avatar_url: data.avatar_url,
        roles: roleFlagsToArray(data.role_flags),
        userType: userTypeFlagsToArray(data.user_type_flags)
      }
    },
    getSessionAttributes: async (databaseSession: SessionSchema) => {
      console.log(
        `[api] [middleware] [auth] [lucia] [getSessionAttributes] -> databaseSession: ${JSON.stringify(
          databaseSession
        )}`
      )
      const dbUser = Object.assign({}, await q.getUserById(databaseSession.user_id))
      const roles: UserRole[] = roleFlagsToArray(databaseSession.user.role_flags)
      delete (dbUser as { role_flags?: unknown }).role_flags
      const userTypes: UserType[] = userTypeFlagsToArray(dbUser.user_type_flags)[0]
      const user: User = { ...dbUser, roles, userId: dbUser.id }
      return {
        sessionId: databaseSession.id,
        user,
        activePerdiodExpiresAt: databaseSession.activePerdiodExpiresAt,
        idlePerdiodExpiresAt: databaseSession.idlePerdiodExpiresAt,
        state: databaseSession.state,
        fresh: databaseSession.fresh
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
