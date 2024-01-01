import { generateRandomString } from 'lucia/utils'
import {
  createAuth,
  jsonOkResponse,
  badResponse,
  serverErrorResponse,
  getBaseUrl
} from '#/api/src/middleware'
import { LUCIA_AUTH_COOKIES_SESSION_TOKEN, UserRole, UserType } from '#/types'
import { OpenAPIRoute } from '@cloudflare/itty-router-openapi'
import { AuthLoginSchema, AuthRegisterSchema } from '../auth-schema'
import { ZodError } from 'zod'
import {
  AuthLoginBodyComponent,
  AuthLoginBodyType,
  AuthRegisterBodyComponent,
  AuthRegisterBodyType
} from '../auth-component'

import { castBoolToInt } from '#/api/db/d1-kysely-lucia/cast'
import { LuciaError } from 'lucia'
import {
  arrayBufferToBase64,
  arrayToRoleFlags,
  arrayToUserTypeFlags,
  base64ToArrayBuffer,
  importKey,
  signData
} from '#/utils'

export class RegisterPasswordUser extends OpenAPIRoute {
  static schema = AuthRegisterSchema

  async handle(
    req: Request,
    res: Response,
    env: Env,
    ctx: ExecutionContext,
    data: { body: AuthRegisterBodyType }
  ) {
    req.logger.info(`[api] [auth] [register] [password]`)
    console.log(`[api] [auth] [register] [password] -> data: ${JSON.stringify(data, null, 2)}`)
    console.log(`[api] [auth] [register] [password] -> body: ${JSON.stringify(data.body, null, 2)}`)
    try {
      const loginBody =
        env.NODE_ENV === 'development'
          ? AuthRegisterBodyComponent.parse(data)
          : AuthRegisterBodyComponent.parse(data.body)
      console.log(
        `[api] [auth] [register] [password] -> loginBody: ${JSON.stringify(loginBody, null, 2)}`
      )
      if (!loginBody) {
        return badResponse('Invalid login body', new Error(JSON.stringify(loginBody)), res)
      }
      const { username, password, email } = loginBody
      const { auth } = await createAuth(env)
      const user = await auth.createUser({
        key: {
          providerId: 'username', // auth method
          providerUserId: username, // unique id when using "username" auth method
          // providerUserId: username.toLowerCase(), // unique id when using "username" auth method
          password // hashed by Lucia
        },
        attributes: {
          username,
          // username_lower: username.toLowerCase(),
          email: email.toLowerCase(),
          email_verified: castBoolToInt(false),
          role_flags: arrayToRoleFlags([UserRole.User]),
          user_type_flags: arrayToUserTypeFlags([UserType.Credentials]),
          avatar_url: 'https://www.gravatar.com/avatar/?d=retro&s=35'
        }
      })

      const session = await auth.createSession({
        userId: user.userId,
        sessionId: await res.cryptoSign(generateRandomString(40)),
        attributes: {}
      })

      const sessionCookie = auth.createSessionCookie(session).serialize()
      // console.log(`[api] [auth] [register] [password] -> sessionCookie:`)
      // console.log(sessionCookie)

      // await res.cookie(req, res, env, LUCIA_AUTH_COOKIES_SESSION_TOKEN, sessionCookie)
      res.headers.set('Set-Cookie', `${LUCIA_AUTH_COOKIES_SESSION_TOKEN}=${sessionCookie}`)
      return jsonOkResponse(session, res)
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        if (error.message.includes('D1_ERROR')) {
          return badResponse('User already exists', error, res)
        }
      }
      if (error instanceof ZodError) {
        return new Response(JSON.stringify(error), { status: 400 })
      }
      return serverErrorResponse('Error registering', error, res)
    }
  }
}

export class LoginPasswordUser extends OpenAPIRoute {
  static schema = AuthLoginSchema

  async handle(
    req: Request,
    res: Response,
    env: Env,
    ctx: ExecutionContext,
    data: { body: AuthLoginBodyType }
  ) {
    req.logger.info(`[api] [auth] [login] [password]`)
    // console.log(`[api] [auth] [login] [password] -> data: ${JSON.stringify(data, null, 2)}`)
    // console.log(`[api] [auth] [login] [password] -> body: ${JSON.stringify(data.body, null, 2)}`)
    try {
      const loginBody =
        env.NODE_ENV === 'development'
          ? AuthLoginBodyComponent.safeParse(data)
          : AuthLoginBodyComponent.safeParse(data.body)
      // console.log(
      //   `[api] [auth] [login] [password] -> loginBody: ${JSON.stringify(loginBody, null, 2)}`
      // )
      if (!loginBody) {
        return badResponse('Invalid login body', new Error(JSON.stringify(loginBody)), res)
      }
      // const { username, password, email } = data.body
      if (!loginBody.success) {
        return badResponse('Invalid login body', new Error(JSON.stringify(loginBody)), res)
      }
      const { password } = loginBody.data
      const { auth } = await createAuth(env)
      const emailOrUsername =
        'email' in loginBody.data ? loginBody.data?.email : loginBody.data?.username
      const usernameOrEmail =
        'username' in loginBody.data ? loginBody.data?.username : loginBody.data?.email
      const key = usernameOrEmail
        ? await auth.useKey('username', usernameOrEmail.toLowerCase(), password)
        : await auth.useKey('email', emailOrUsername.toLowerCase(), password)

      // console.log(`[api] [auth] [login] [password] -> key:`)
      // console.log(key)
      const session = await auth.createSession({
        userId: key.userId,
        sessionId: await res.cryptoSign(generateRandomString(40)),
        attributes: {}
      })
      // console.log(`[api] [auth] [login] [password] -> session: ${JSON.stringify(session, null, 2)}`)

      const sessionCookie = auth.createSessionCookie(session).serialize()
      // console.log(`[api] [auth] [login] [password] -> sessionCookie:`)
      // console.log(sessionCookie)
      const { baseUrlApp } = getBaseUrl(env)
      const dataPage = new URL(`${baseUrlApp}/api-data`).href

      // await res.cookie(req, res, env, LUCIA_AUTH_COOKIES_SESSION_TOKEN, sessionCookie)
      res.headers.set('Set-Cookie', sessionCookie)
      return jsonOkResponse(dataPage, res)
      // return redirectHtml(dataPage, sessionCookie, 302)
      // return jsonOkResponse(session, res)
    } catch (error) {
      console.error(error)
      if (error instanceof ZodError) {
        return new Response(JSON.stringify(error), { status: 400 })
      }
      if (error instanceof LuciaError) {
        if (error.message.includes('AUTH_INVALID_KEY_ID'))
          // user not registered - but avoid in message for security - TODO improve
          return badResponse('Invalid login body', error, res)
      }
      if (error instanceof Error) {
        return badResponse('Unknown Error', error, res)
      }
      return serverErrorResponse('Error logging in', error, res)
    }
  }
}
