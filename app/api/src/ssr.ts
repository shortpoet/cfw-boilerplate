import { renderPage } from 'vike/server'
import { ExecutionContext } from '@cloudflare/workers-types'
import { logger, tryLogHeaders, logObjs, getAuthCookies } from '#/utils'
// import { getSessionItty } from './middleware';
import { UserRole } from '#/types'
import { getSession } from './router/routes/auth/handlers'
import { ROUTE_MAPPING } from '#/ui/src/pages/routeMapping'

export { handleSsr }

async function handleSsr(req: Request, res: Response, env: Env, ctx: ExecutionContext) {
  const session = await getSession(req, env)
  req.logger.info(`[api] [ssr] handleSsr -> url -> ${req.url}`)
  req.logger.info(`[api] [ssr] handleSsr -> session ->`)
  req.logger.info(session)
  const cookieHeader = req.headers.get('cookie') || ''
  req.logger.debug(`[api] [ssr] handleSsr -> cookieHeader -> ${cookieHeader}`)
  const { sessionToken, csrfToken, callbackUrl, pkceCodeVerifier } = getAuthCookies(cookieHeader)
  req.logger.debug(`[api] [ssr] handleSsr -> sessionToken -> ${sessionToken}`)
  const userAgent = req.headers.get('User-Agent') || ''
  const endpoints = Object.values(ROUTE_MAPPING)
  // req.logger.debug(`[api] [ssr] handleSsr -> endpoints ->`)
  // req.logger.debug(endpoints)

  const pageContextInit = {
    urlOriginal: req.url,
    fetch: (...args: Parameters<typeof fetch>) => fetch(...args),
    // isAdmin: session?.user?.roles?.includes(UserRole.Admin) || false,
    userAgent,
    session,
    cf: req.cf,
    csrfToken,
    callbackUrl,
    endpoints,
    // authRedirectUrl,
    sessionToken,
    pkceCodeVerifier
  }
  // req.logger.debug(`[api] [ssr] handleSsr -> pageContextInit ->`);
  // req.logger.debug(pageContextInit);
  const pageContext = await renderPage(pageContextInit)
  const { httpResponse } = pageContext
  if (!httpResponse) {
    return null
  } else {
    const { statusCode: status, headers } = httpResponse
    const { readable, writable } = new TransformStream()
    httpResponse.pipe(writable)
    return new Response(readable, {
      headers,
      status
    })
  }
}
