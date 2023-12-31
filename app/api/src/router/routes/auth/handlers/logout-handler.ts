import { LUCIA_AUTH_COOKIES_SESSION_TOKEN } from '#/types'
import {
  badResponse,
  createAuth,
  getBaseUrl,
  jsonOkResponse,
  okResponse
} from '../../../../middleware'
import { redirectResponse } from '../../../../middleware/redirect'

export const logout = async (req: Request, res: Response, env: Env, ctx: ExecutionContext) => {
  const { auth } = await createAuth(env)
  const authRequest = auth.handleRequest(req)
  // check if user is authenticated
  const session = await authRequest.validate() // or `authRequest.validateBearerToken()`
  req.logger.info(`[api] [auth] [logout] -> session:`)
  console.log(`[api] [auth] [logout] -> session:`)
  // for session cookies
  // create blank session cookie
  const sessionCookie = auth.createSessionCookie(null)

  // console.log(session);
  if (!session) {
    console.log(`\n[api] [auth] [logout] -> NO !session\n`)
    res.cookie(req, res, env, LUCIA_AUTH_COOKIES_SESSION_TOKEN, sessionCookie.serialize())
    return okResponse(undefined, res)
    // return new Response('Unauthorized', {
    //   status: 401
    // })
  }
  console.log(`\n[api] [auth] [logout] -> RETURN session\n`)
  // return jsonOkResponse({ session }, res);
  try {
    // make sure to invalidate the current session!
    await auth.invalidateSession(session.sessionId)

    const { baseUrlApp } = getBaseUrl(env)
    res.cookie(req, res, env, LUCIA_AUTH_COOKIES_SESSION_TOKEN, sessionCookie.serialize())
    const url = `${baseUrlApp}/auth/login`
    return jsonOkResponse({ url }, res)
    // redirectResponse(loginPage, 302, {
    //   'Set-Cookie': sessionCookie.serialize(), // delete session cookie
    // });
  } catch (error) {
    req.logger.error(`[api] [auth] [logout] -> error:`)
    req.logger.error(error)
    if (error instanceof Error) {
      return badResponse('Logout Error', error, res)
    } else {
      try {
        return badResponse(JSON.stringify(error), undefined, res)
      } catch (error) {
        return badResponse('Logout Error', undefined, res)
      }
    }
  }
}
