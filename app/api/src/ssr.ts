import { renderPage } from 'vike/server';
import { ExecutionContext } from '@cloudflare/workers-types';
import { logger, tryLogHeaders, logObjs, getAuthCookies } from '#/utils';
// import { getSessionItty } from './middleware';
import { UserRole } from '#/types';

export { handleSsr };

async function handleSsr(req: Request, res: Response, env: Env, ctx: ExecutionContext) {
  req.logger.info(`[api] [ssr] handleSsr -> url -> ${req.url}`);
  const cookieHeader = req.headers.get('cookie') || '';
  req.logger.debug(`[api] [ssr] handleSsr -> cookieHeader -> ${cookieHeader}`);
  const { sessionToken, csrfToken, callbackUrl, pkceCodeVerifier } = getAuthCookies(cookieHeader);
  req.logger.debug(`[api] [ssr] handleSsr -> sessionToken -> ${sessionToken}`);
  const userAgent = req.headers.get('User-Agent') || '';
  const pageContextInit = {
    urlOriginal: req.url,
    fetch: (...args: Parameters<typeof fetch>) => fetch(...args),
    // isAdmin: session?.user?.roles?.includes(UserRole.Admin) || false,
    userAgent,
    session: res.session,
    cf: req.cf,
    csrfToken,
    callbackUrl,
    // authRedirectUrl,
    sessionToken,
    pkceCodeVerifier,
  };
  req.logger.debug(`[api] [ssr] handleSsr -> pageContextInit ->`);
  req.logger.debug(pageContextInit);
  const pageContext = await renderPage(pageContextInit);
  const { httpResponse } = pageContext;
  if (!httpResponse) {
    return null;
  } else {
    const { statusCode: status, headers } = httpResponse;
    const { readable, writable } = new TransformStream();
    httpResponse.pipe(writable);
    return new Response(readable, {
      headers,
      status,
    });
  }
}
