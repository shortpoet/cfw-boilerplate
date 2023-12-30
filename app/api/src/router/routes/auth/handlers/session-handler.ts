import {
  createAuth,
  jsonOkResponse,
  notFoundResponse,
  serverErrorResponse
} from '../../../../middleware'
import { q } from '#/api/db'

export const getSession = async (req: Request, env: Env) => {
  console.log(`[api] [auth] [session] ->`)
  const { auth } = await createAuth(env)
  console.log(`[api] [auth] [session] -> auth:`)
  const authRequest = auth.handleRequest(req)
  console.log(`[api] [auth] [session] -> authRequest:`)
  const session = await authRequest.validate() // or `authRequest.validateBearerToken()`
  console.log(`[api] [auth] [session] -> session:`)
  return session
}

export const session = async (req: Request, res: Response, env: Env, ctx: ExecutionContext) => {
  const session = await getSession(req, env)
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
