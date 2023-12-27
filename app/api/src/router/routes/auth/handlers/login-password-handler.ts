import { redirectResponse } from '#/api/src/middleware/redirect'
import { OAuthRequestError } from '@lucia-auth/oauth'
import { parseCookie } from 'lucia/utils'
import sig from 'cookie-signature-subtle'
import {
  createAuth,
  jsonOkResponse,
  badResponse,
  serverErrorResponse,
  getBaseUrl,
  notFoundResponse
} from '#/api/src/middleware'
import { LUCIA_AUTH_COOKIES_SESSION_TOKEN, UserRole } from '#/types'
import { OpenAPIRoute } from '@cloudflare/itty-router-openapi'
import { AuthLoginSchema, AuthRegisterSchema } from '../auth-schema'
import { ZodError, z } from 'zod'
import {
  AuthLoginBodyComponent,
  AuthLoginBodyType,
  AuthRegisterBodyComponent,
  AuthRegisterBodyType
} from '../auth-component'

export const loginPassword = async (
  req: Request,
  res: Response,
  env: Env,
  ctx: ExecutionContext
) => {
  const { auth, githubAuth } = await createAuth(env)
  const authRequest = auth.handleRequest(req)
  const session = await authRequest.validate()
  const reqUrl = new URL(req.url).href
  if (session) {
    return redirectResponse(reqUrl, 302, res.headers)
  }
}

export class RegisterPasswordUser extends OpenAPIRoute {
  static schema = AuthRegisterSchema

  async handle(
    req: Request,
    res: Response,
    env: Env,
    ctx: ExecutionContext,
    data: { body: AuthRegisterBodyType }
  ) {
    req.logger.info(`[api] [auth] [login] [password]`)
    console.log(`[api] [auth] [login] [password] -> data: ${JSON.stringify(data, null, 2)}`)
    console.log(`[api] [auth] [login] [password] -> body: ${JSON.stringify(data.body, null, 2)}`)
    try {
      const loginBody =
        env.NODE_ENV === 'development'
          ? AuthRegisterBodyComponent.parse(data)
          : AuthRegisterBodyComponent.parse(data.body)
      console.log(
        `[api] [auth] [login] [password] -> loginBody: ${JSON.stringify(loginBody, null, 2)}`
      )
      if (!loginBody) {
        return badResponse('Invalid login body', new Error(JSON.stringify(loginBody)), res)
      }
      // const { username, password, email } = data.body
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
          username_lower: username.toLowerCase(),
          email: email.toLowerCase(),
          email_verified: false
        }
      })
      const session = await auth.createSession({
        userId: user.userId,
        attributes: {}
      })
      const sessionCookie = auth.createSessionCookie(session)
      res.headers.set('Set-Cookie', sessionCookie.serialize())
      return jsonOkResponse({ session }, res)
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
    console.log(`[api] [auth] [login] [password] -> data: ${JSON.stringify(data, null, 2)}`)
    console.log(`[api] [auth] [login] [password] -> body: ${JSON.stringify(data.body, null, 2)}`)
    try {
      const loginBody =
        env.NODE_ENV === 'development'
          ? AuthLoginBodyComponent.safeParse(data)
          : AuthLoginBodyComponent.safeParse(data.body)
      console.log(
        `[api] [auth] [login] [password] -> loginBody: ${JSON.stringify(loginBody, null, 2)}`
      )
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

      const session = await auth.createSession({
        userId: key.userId,
        attributes: {}
      })

      const sessionCookie = auth.createSessionCookie(session)
      res.headers.set('Set-Cookie', sessionCookie.serialize())
      return jsonOkResponse({ session }, res)
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return badResponse('Unknown Error', error, res)
      }
      if (error instanceof ZodError) {
        return new Response(JSON.stringify(error), { status: 400 })
      }
      return serverErrorResponse('Error logging in', error, res)
    }
  }
}
