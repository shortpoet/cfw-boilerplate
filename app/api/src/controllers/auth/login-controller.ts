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
} from '../../middleware'
import { LUCIA_AUTH_COOKIES_SESSION_TOKEN } from '#/types'

export const loginGithub = async (req: Request, res: Response, env: Env, ctx: ExecutionContext) => {
  const { auth, githubAuth } = await createAuth(env)
  const authRequest = auth.handleRequest(req)
  const session = await authRequest.validate()
  const reqUrl = new URL(req.url).href
  if (session) {
    return redirectResponse(reqUrl, 302, res.headers)
  }
  const [url, state] = await githubAuth.getAuthorizationUrl()
  console.log(`[api] [auth] [login] [github] -> url: ${url}`)
  await res.cookie(req, res, env, LUCIA_AUTH_COOKIES_SESSION_TOKEN, state, {
    httpOnly: false,
    secure: false,
    path: '/',
    maxAge: 60 * 60,
    sameSite: 'lax'
  })
  return jsonOkResponse({ url }, res)
}

export const loginGithubCallback = async (
  req: Request,
  res: Response,
  env: Env,
  ctx: ExecutionContext
) => {
  req.logger.info(`[api] [auth] [login] [github] [callback]`)
  const { auth, githubAuth } = await createAuth(env)
  const authRequest = auth.handleRequest(req)
  const session = await authRequest.validate()
  const { baseUrlApp } = getBaseUrl(env)
  const dataPage = `${baseUrlApp}/api-data`
  if (session) {
    return redirectResponse(dataPage, 302, res.headers)
  }
  const cookies = parseCookie(req.headers.get('cookie') ?? '')
  const secret = env.NEXTAUTH_SECRET
  const storedState = cookies[LUCIA_AUTH_COOKIES_SESSION_TOKEN]
    ? await sig.unsign(cookies[LUCIA_AUTH_COOKIES_SESSION_TOKEN].replace('s:', ''), secret)
    : ''
  const state = req.query?.state
  const code = req.query?.code
  req.logger.debug(`[api] [auth] [login] [github] -> storedState: ${storedState}`)
  // validate state
  if (!storedState || !state || storedState !== state || typeof code !== 'string') {
    return badResponse('Bad Request', undefined, res)
  }
  try {
    const { getExistingUser, githubUser, createUser } = await githubAuth.validateCallback(code)
    const getUser = async () => {
      const existingUser = await getExistingUser()
      if (existingUser) return existingUser
      const user = await createUser({
        attributes: {
          username: githubUser.login
        }
      })
      return user
    }

    const user = await getUser()
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {}
    })
    const sessionCookie = auth.createSessionCookie(session)
    sessionCookie.attributes.httpOnly = false
    res.headers.set('Set-Cookie', sessionCookie.serialize())

    // return Response.redirect(dataPage, 302).headers.set('Set-Cookie', sessionCookie.serialize());
    return jsonOkResponse({ session }, res)
  } catch (e) {
    if (e instanceof OAuthRequestError) {
      // invalid code
      return badResponse('Invalid code', undefined, res)
    }
    req.logger.error(`[api] [auth] [login] [github] -> error: ${e}`)
    return serverErrorResponse('Server error', new Error(JSON.stringify(e)), res)
  }
}
