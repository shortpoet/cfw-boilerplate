// lucia.ts
import { lucia, LuciaError, Middleware, SessionSchema } from 'lucia'
import 'lucia/polyfill/node'
import { web } from 'lucia/middleware'
// import { google } from '@lucia-auth/oauth/providers';
import { github } from '@lucia-auth/oauth/providers'

import { deriveDatabaseAdapter, q } from '#/api/db/d1-kysely-lucia'

import {
  LUCIA_AUTH_COOKIES_OPTIONS,
  LUCIA_AUTH_COOKIES_OPTIONS_SECURE,
  LUCIA_AUTH_COOKIES_SESSION_TOKEN,
  Session,
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
    debugMode: env.NODE_ENV !== 'production',
    middleware: web(),
    adapter,
    sessionCookie: {
      name: LUCIA_AUTH_COOKIES_SESSION_TOKEN,
      expires: false, // to false since we (lucia web()) can’t update the session cookie when validating them
      attributes:
        env.NODE_ENV === 'production'
          ? LUCIA_AUTH_COOKIES_OPTIONS_SECURE
          : LUCIA_AUTH_COOKIES_OPTIONS
      // parseSignedCookie: async (cookie: string) => {
      //   const parsedCookie = parseCookie((await unsignCookie(cookie, env.NEXTAUTH_SECRET)) || '')
      //   // I really don't like requiring `if` statements inside options
      //   if (parsedCookie === null) return null // log request - cookie possibly tampered with
      //   if (new Date(parsedCookie.expires) < new Date()) return null // log request - cookie expired
      //   return parsedCookie.sessionId
      // },
      // signCookie: (session: Session) => {
      //   // return signCookie(session.sessionId, session.idlePeriodExpiresAt)
      //   return signCookie(session.sessionId, env.NEXTAUTH_SECRET)
      // }
    },
    csrfProtection: {
      allowedSubDomains: '*'
    },
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
        userTypes: userTypeFlagsToArray(data.user_type_flags)
      }
    }
    // getSessionAttributes: async (databaseSession: SessionSchema) => {
    //   console.log(
    //     `[api] [middleware] [auth] [lucia] [getSessionAttributes] -> databaseSession: ${JSON.stringify(
    //       databaseSession
    //     )}`
    //   )
    //   const dbUser = await adapter(LuciaError).getUser(databaseSession.user_id)
    //   // const dbUser = Object.assign({}, await q.getUserById(databaseSession.user_id))
    //   const roles: UserRole[] = roleFlagsToArray(dbUser.role_flags)
    //   delete (dbUser as { role_flags?: unknown }).role_flags
    //   const userTypes: UserType[] = userTypeFlagsToArray(dbUser.user_type_flags)
    //   delete (dbUser as { user_type_flags?: unknown }).user_type_flags
    //   console.log(`[api] [middleware] [auth] [lucia] [getSessionAttributes] -> dbUser:`)
    //   console.log(dbUser)
    //   const user: User = {
    //     ...dbUser,
    //     roles,
    //     userId: dbUser.id,
    //     userTypes: userTypes,
    //     email_verified: castIntToBool(dbUser.email_verified)
    //   }
    //   console.log(`[api] [middleware] [auth] [lucia] [getSessionAttributes] -> user:`)
    //   console.log(user)
    //   return {
    //     sessionId: databaseSession.id,
    //     user,
    //     activePerdiodExpiresAt: databaseSession.activePerdiodExpiresAt,
    //     idlePerdiodExpiresAt: databaseSession.idlePerdiodExpiresAt,
    //     state: databaseSession.state,
    //     fresh: databaseSession.fresh
    //   }
    // },
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
