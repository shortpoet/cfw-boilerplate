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
  OauthLoginBodySchema,
  OauthProvidersEnum,
  UserRole
} from '#/types'
import { OpenAPIRoute } from '@cloudflare/itty-router-openapi'
import { AuthLoginOauthCallbackSchema, AuthLoginOauthSchema } from '../auth-schema'
import { getGithubUser, getGoogleUser } from './oauth-providers'

export class LoginOauth extends OpenAPIRoute {
  static schema = AuthLoginOauthSchema

  async handle(req: Request, res: Response, env: Env, ctx: ExecutionContext) {
    req.logger.info(`[api] [auth] [login] [oauth]`)
    const { auth, googleAuth, githubAuth } = await createAuth(env)
    const query = req.query ? OauthLoginBodySchema.safeParse(req.query) : undefined
    if (query && !query.success) {
      return badResponse('Invalid query', JSON.stringify(query.error), res)
    }
    if (!query) {
      return badResponse('Invalid query', undefined, res)
    }
    const { provider, redirect_url } = query.data
    const providerMapping = {
      github: githubAuth.getAuthorizationUrl,
      google: googleAuth.getAuthorizationUrl,
      twitter: () => Promise.resolve(['twitter', 'twitter']),
      facebook: () => Promise.resolve(['facebook', 'facebook']),
      linkedin: () => Promise.resolve(['linkedin', 'linkedin'])
    }
    const authRequest = auth.handleRequest(req)
    const session = await authRequest.validate()
    const reqUrl = new URL(req.url).href
    if (session) {
      return redirectResponse(reqUrl, 302, res.headers)
    }
    const [url, state] = await providerMapping[provider]()
    console.log(`[api] [auth] [login] [oauth] -> url: ${url}`)
    // TODO fix cookie name so distinct from session token
    await res.cookie(req, res, env, LUCIA_AUTH_COOKIES_SESSION_TOKEN, state)
    if (redirect_url)
      res.headers.set('Set-Cookie', serializeCookie(`${provider}_redirect_url`, redirect_url))
    return jsonOkResponse(url, res)
  }
}

export class LoginOauthCallback extends OpenAPIRoute {
  static schema = AuthLoginOauthCallbackSchema

  async handle(req: Request, res: Response, env: Env, ctx: ExecutionContext) {
    req.logger.info(`[api] [auth] [login] [oauth] [callback]`)
    const { auth } = await createAuth(env)
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
      const parts = new URL(req.url).pathname.split('/')
      const provider = OauthProvidersEnum.safeParse(parts[parts.length - 2])
      if (!provider.success) {
        return badResponse('Bad Request - Provider not found', provider.error, res)
      }
      const providerMapping = {
        google: getGoogleUser,
        github: getGithubUser,
        twitter: () => Promise.resolve(['twitter', 'twitter']),
        facebook: () => Promise.resolve(['facebook', 'facebook']),
        linkedin: () => Promise.resolve(['linkedin', 'linkedin'])
      }
      const user = await providerMapping[provider.data](env, code)

      const session = await auth.createSession({
        userId: user.userId,
        attributes: {}
      })
      const sessionCookie = auth.createSessionCookie(session).serialize()
      console.log(`[api] [auth] [login] [oauth] -> cookie: ${sessionCookie}`)

      // const html = `
      // <!DOCTYPE html>
      // <html>
      // <head>
      // <meta http-equiv="refresh" content="0;URL='${dataPage}'"/>
      // </head>
      // <body><p>Redirecting to <a href="${dataPage}">${dataPage}</a>.</p></body>
      // </html>
      // `
      // const resp = new Response(html, {
      //   headers: {
      //     'content-type': 'text/html;charset=UTF-8'
      //   },
      //   status: 302
      // })
      // resp.headers.set('Set-Cookie', sessionCookie)
      // resp.headers.set('Location', dataPage)
      // return resp

      return redirectHtml(dataPage, sessionCookie, 302)
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
