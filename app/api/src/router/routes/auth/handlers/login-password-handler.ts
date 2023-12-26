import { redirectResponse } from '#/api/src/middleware/redirect'
import { OAuthRequestError } from '@lucia-auth/oauth'
import { parseCookie } from 'lucia/utils'
import sig from 'cookie-signature-subtle'
import {
  createAuth,
  jsonOkResponse,
  badResponse,
  serverErrorResponse,
  getBaseUrl
} from '../../../../middleware'
import { LUCIA_AUTH_COOKIES_SESSION_TOKEN, UserRole } from '#/types'

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
