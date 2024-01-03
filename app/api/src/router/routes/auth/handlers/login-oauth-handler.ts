import { redirectHtml, redirectResponse } from '#/api/src/middleware/redirect'
import { OAuthRequestError } from '@lucia-auth/oauth'
import { parseCookie, serializeCookie } from 'lucia/utils'
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

export class LoginOauth extends OpenAPIRoute {
  static schema = AuthLoginOauthSchema

  async handle(req: Request, res: Response, env: Env, ctx: ExecutionContext) {
    const { auth, googleAuth } = await createAuth(env)
    const authRequest = auth.handleRequest(req)
    const session = await authRequest.validate()
    const reqUrl = new URL(req.url).href
    if (session) {
      return redirectResponse(reqUrl, 302, res.headers)
    }
    console.log(`[api] [auth] [login] [oauth] -> reqUrl: ${reqUrl}`)
    console.log(env.GOOGLE_CLIENT_ID)
    console.log(env.GOOGLE_CLIENT_SECRET)
    const [url, state] = await googleAuth.getAuthorizationUrl()
    console.log(`[api] [auth] [login] [oauth] -> url: ${url}`)
    await res.cookie(req, res, env, LUCIA_AUTH_COOKIES_SESSION_TOKEN, state)
    return jsonOkResponse(url, res)
  }
}

export class LoginOauthCallback extends OpenAPIRoute {
  static schema = AuthLoginOauthCallbackSchema

  async handle(req: Request, res: Response, env: Env, ctx: ExecutionContext) {
    req.logger.info(`[api] [auth] [login] [oauth] [callback]`)
    const { auth, googleAuth } = await createAuth(env)
    const authRequest = auth.handleRequest(req)
    const session = await authRequest.validate()
    const { baseUrlApp } = getBaseUrl(env)
    const dataPage = new URL(`${baseUrlApp}/api-data`).href
    if (session) {
      return redirectResponse(dataPage, 302, res.headers)
    }
    const cookies = parseCookie(req.headers.get('cookie') ?? '')
    const cook = cookies[LUCIA_AUTH_COOKIES_SESSION_TOKEN]
    req.logger.debug(`[api] [auth] [login] [oauth] [callback] -> cook: ${cook}`)
    const secret = env.AUTH_SECRET

    const storedState = cookies[LUCIA_AUTH_COOKIES_SESSION_TOKEN]
      ? await sig.unsign(cookies[LUCIA_AUTH_COOKIES_SESSION_TOKEN].replace('s:', ''), secret)
      : ''
    // const storedState = cook ? await unsignCookie(cook.replace('s:', ''), secret) : ''

    const state = req.query?.state
    const code = req.query?.code
    req.logger.debug(`[api] [auth] [login] [oauth] -> storedState: ${storedState}`)
    // validate state
    if (!storedState || !state || storedState !== state || typeof code !== 'string') {
      return badResponse('Bad Request - State Unvalidated', undefined, res)
    }
    try {
      const { getExistingUser, googleUser, createUser, googleTokens } =
        await googleAuth.validateCallback(code)
      // const emailRequest = await fetch('https://api.oauth.com/user/emails', {
      //   headers: {
      //     Authorization: `token ${oauthTokens.accessToken}`,
      //     Accept: 'application/vnd.oauth.v3+json',
      //     'User-Agent': 'Lucia',
      //     'Content-Type': 'application/json',
      //     'Accept-Encoding': 'gzip, deflate'
      //   }
      // })
      // if (!emailRequest.ok) {
      //   console.log(`[api] [auth] [login] [oauth] -> emailRequest not ok`)
      //   console.log(emailRequest)
      //   throw new Error('Unable to fetch email')
      // }
      // const emails: { email: string; verified: boolean; primary: boolean }[] =
      //   await emailRequest.json()
      // const verifiedEmail = emails.find((email: any) => email.verified)
      // const primaryEmail = emails.find((email: any) => email.primary)
      // const primaryVerifiedEmail = emails.find((email: any) => email.primary && email.verified)
      // const isVerified = primaryVerifiedEmail || verifiedEmail || primaryEmail
      const getUser = async () => {
        const existingUser = await getExistingUser()
        if (existingUser) return existingUser
        const user = await createUser({
          attributes: {
            username: googleUser.sub,
            email: googleUser.email,
            name: googleUser.name,
            avatar_url: googleUser.picture
            // user_type_flags: arrayToUserTypeFlags([UserType.Credentials]),
          }
        })
        return user
      }

      const user = await getUser()
      const session = await auth.createSession({
        userId: user.userId,
        attributes: {}
      })
      const sessionCookie = auth.createSessionCookie(session).serialize()
      console.log(`[api] [auth] [login] [oauth] -> cookie: ${sessionCookie}`)

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
      resp.headers.set('Set-Cookie', sessionCookie)
      resp.headers.set('Location', dataPage)
      return resp

      // return redirectHtml(dataPage, cookie, 302)

      // res.headers.set('Set-Cookie', cookie)
      // res.headers.set('Location', dataPage)
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
      req.logger.error(`[api] [auth] [login] [oauth] -> error: ${e}`)
      return serverErrorResponse('Internal Server Error', new Error(JSON.stringify(e)), res)
    }
  }
}
