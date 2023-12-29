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
import {
  LUCIA_AUTH_COOKIES_OPTIONS,
  LUCIA_AUTH_COOKIES_OPTIONS_SECURE,
  LUCIA_AUTH_COOKIES_SESSION_TOKEN,
  UserRole
} from '#/types'
import { OpenAPIRoute } from '@cloudflare/itty-router-openapi'
import { AuthLoginOauthCallbackSchema, AuthLoginOauthSchema } from '../auth-schema'
import { handleSsr } from '#/api/src/ssr'

export class LoginGithub extends OpenAPIRoute {
  static schema = AuthLoginOauthSchema

  async handle(req: Request, res: Response, env: Env, ctx: ExecutionContext) {
    const { auth, githubAuth } = await createAuth(env)
    const authRequest = auth.handleRequest(req)
    const session = await authRequest.validate()
    const reqUrl = new URL(req.url).href
    if (session) {
      return redirectResponse(reqUrl, 302, res.headers)
    }
    const [url, state] = await githubAuth.getAuthorizationUrl()
    console.log(`[api] [auth] [login] [github] -> url: ${url}`)
    const cookieOptions =
      env.NODE_ENV === 'production' ? LUCIA_AUTH_COOKIES_OPTIONS_SECURE : LUCIA_AUTH_COOKIES_OPTIONS
    await res.cookie(req, res, env, LUCIA_AUTH_COOKIES_SESSION_TOKEN, state, cookieOptions)
    return jsonOkResponse(url, res)
  }
}

export class LoginGithubCallback extends OpenAPIRoute {
  static schema = AuthLoginOauthCallbackSchema

  async handle(req: Request, res: Response, env: Env, ctx: ExecutionContext) {
    req.logger.info(`[api] [auth] [login] [github] [callback]`)
    const { auth, githubAuth } = await createAuth(env)
    const authRequest = auth.handleRequest(req)
    const session = await authRequest.validate()
    const { baseUrlApp } = getBaseUrl(env)
    const dataPage = new URL(`${baseUrlApp}/api-data`).href
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
      const { getExistingUser, githubUser, createUser, githubTokens } =
        await githubAuth.validateCallback(code)
      const emailRequest = await fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `token ${githubTokens.accessToken}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'Lucia',
          'Content-Type': 'application/json',
          'Accept-Encoding': 'gzip, deflate'
        }
      })
      if (!emailRequest.ok) {
        console.log(`[api] [auth] [login] [github] -> emailRequest not ok`)
        console.log(emailRequest)
        throw new Error('Unable to fetch email')
      }
      const emails: { email: string; verified: boolean; primary: boolean }[] =
        await emailRequest.json()
      const verifiedEmail = emails.find((email: any) => email.verified)
      const primaryEmail = emails.find((email: any) => email.primary)
      const primaryVerifiedEmail = emails.find((email: any) => email.primary && email.verified)
      const isVerified = primaryVerifiedEmail || verifiedEmail || primaryEmail
      const getUser = async () => {
        const existingUser = await getExistingUser()
        if (existingUser) return existingUser
        const user = await createUser({
          attributes: {
            username: githubUser.login,
            email: isVerified ? isVerified.email : undefined,
            name: githubUser.name,
            avatar_url: githubUser.avatar_url
            // roles: [UserRole.User]
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
      // sessionCookie.attributes.httpOnly = true
      // sessionCookie.attributes.sameSite = 'lax'

      res.headers.set('Set-Cookie', sessionCookie.serialize())
      res.headers.set('Location', dataPage)

      const html = `
      <!DOCTYPE html>
      <html>
      <head>
      <meta http-equiv="refresh" content="0;URL='${dataPage}'"/>
      </head>
      <body><p>Redirecting to <a href="${dataPage}">${dataPage}</a>.</p></body>
      </html>
      `
      const resp = new Response(html, {
        headers: {
          'content-type': 'text/html;charset=UTF-8'
        },
        status: 302
      })
      resp.headers.set('Set-Cookie', sessionCookie.serialize())
      resp.headers.set('Location', dataPage)
      return resp

      // return jsonOkResponse(session, res)
      // return Response.redirect(dataPage, 302)
      // const newReq = new Request(dataPage)
      // newReq.logger = req.logger
      // return await handleSsr(newReq, res, env, ctx)
    } catch (e) {
      if (e instanceof OAuthRequestError) {
        // invalid code
        return badResponse('Invalid code', undefined, res)
      }
      req.logger.error(`[api] [auth] [login] [github] -> error: ${e}`)
      return serverErrorResponse('Internal Server Error', new Error(JSON.stringify(e)), res)
    }
  }
}
