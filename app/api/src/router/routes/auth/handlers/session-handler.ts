import { createAuth, jsonOkResponse } from '../../../../middleware'

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
