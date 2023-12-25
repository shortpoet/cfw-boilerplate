import { createAuth, jsonOkResponse } from '../../../../middleware'

export const getSession = async (req: Request, env: Env) => {
  const { auth } = await createAuth(env)
  const authRequest = auth.handleRequest(req)
  const session = await authRequest.validate() // or `authRequest.validateBearerToken()`
  return session
}

export const session = async (req: Request, res: Response, env: Env, ctx: ExecutionContext) => {
  const session = await getSession(req, env)
  return jsonOkResponse(session, res)
}
