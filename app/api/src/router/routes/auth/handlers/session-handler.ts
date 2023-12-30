import {
  createAuth,
  jsonOkResponse,
  notFoundResponse,
  serverErrorResponse
} from '../../../../middleware'
import { q } from '#/api/db'
import { LuciaError } from 'lucia'

export const getSession = async (req: Request, res: Response, env: Env, ctx: ExecutionContext) => {
  try {
    console.log(`[api] [auth] [session] ->`)
    const { auth } = await createAuth(env)
    console.log(`[api] [auth] [session] -> auth:`)
    const authRequest = auth.handleRequest(req)
    console.log(`[api] [auth] [session] -> authRequest:`)
    const session = await authRequest.validate() // or `authRequest.validateBearerToken()`
    console.log(`[api] [auth] [session] -> session:`)
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

export const session = async (req: Request, res: Response, env: Env, ctx: ExecutionContext) => {
  const session = await getSession(req, res, env, ctx)
  return jsonOkResponse(session, res)
}

export const getAllSessions = async (
  req: Request,
  res: Response,
  env: Env,
  ctx: ExecutionContext
) => {
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
