import {
  createAuth,
  jsonOkResponse,
  notFoundResponse,
  serverErrorResponse
} from '../../../../middleware'
import { q } from '#/api/db'
import { LuciaError } from 'lucia'
import { AuthSessionSchema, AuthSessionsSchema } from '../auth-schema'
import { OpenAPIRoute } from '@cloudflare/itty-router-openapi'

export class SessionGet extends OpenAPIRoute {
  static schema = AuthSessionSchema

  async handle(req: Request, res: Response, env: Env, ctx: ExecutionContext) {
    try {
      console.log(`[api] [auth] [getSession] ->`)
      // console.log(`[api] [auth] [getSession] -> headers:`)
      // console.log(req.headers)
      const { auth } = await createAuth(env)
      console.log(`[api] [auth] [getSession] -> auth:`)
      const authRequest = auth.handleRequest(req)
      console.log(`[api] [auth] [getSession] -> authRequest:`)
      const session = await authRequest.validate() // or `authRequest.validateBearerToken()`
      console.log(`[api] [auth] [getSession] -> session: ${!!session}}`)
      return session
    } catch (error) {
      console.error(error)
      if (error instanceof LuciaError) {
        console.error(error)
        return notFoundResponse('No session found', error, res)
      }
      return serverErrorResponse('Error getting session', error, res)
    }
  }
}

export class SessionsGet extends OpenAPIRoute {
  static schema = AuthSessionsSchema

  async handle(req: Request, res: Response, env: Env, ctx: ExecutionContext) {
    try {
      const result =
        env.NODE_ENV === 'development' ? await q.getAllSessionsLocal() : await q.getAllSessions()
      if (!result) {
        return notFoundResponse('No users found')
      }
      return jsonOkResponse(result, res)
    } catch (error) {
      console.error(error)
      return serverErrorResponse('Error getting users', error, res)
    }
  }
}
