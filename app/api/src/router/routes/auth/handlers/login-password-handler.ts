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
import { AuthRegisterSchema } from '../auth-schema'
import { AuthLoginBody, AuthLoginBodyType } from '../auth-component'
import { ZodError, z } from 'zod'

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
    data: { body: AuthLoginBodyType }
  ) {
    req.logger.info(`[api] [auth] [login] [password]`)
    console.log(`[api] [auth] [login] [password] -> data: ${JSON.stringify(data, null, 2)}`)
    console.log(`[api] [auth] [login] [password] -> body: ${JSON.stringify(data.body, null, 2)}`)
    try {
      const loginBody =
        env.NODE_ENV === 'development' ? AuthLoginBody.parse(data) : AuthLoginBody.parse(data.body)
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
          providerUserId: username.toLowerCase(), // unique id when using "username" auth method
          password // hashed by Lucia
        },
        attributes: {
          username,
          email
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
      return serverErrorResponse('Error getting user', error, res)
    }
  }
}
