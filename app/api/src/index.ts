import { ExecutionContext } from '@cloudflare/workers-types'
import { MethodNotAllowedError, NotFoundError } from '@cloudflare/kv-asset-handler/dist/types'
import { isAPiURL, isAssetURL, isSSR, logObjs, logWorkerEnd, logWorkerStart } from '#/utils'
import { Api, corsify } from './router'
import { handleStaticAssets } from './static-assets'
import { handleSsr } from './ssr'

const FILE_LOG_LEVEL = 'debug'
import { getCorrelationId, getLogger } from '#/utils/logger/logger'

export default {
  async fetch(
    req: Request,
    env: Env,
    ctx: ExecutionContext,
    data: Record<string, any>
  ): Promise<Response> {
    try {
      logWorkerStart(req, env)
      return await handleFetchEvent(req, env, ctx, data)
    } catch (e) {
      console.error(e)
      if (e instanceof NotFoundError) {
        return new Response('Not Found', { status: 404 })
      } else if (e instanceof MethodNotAllowedError) {
        return new Response('Method Not Allowed', { status: 405 })
      } else {
        return new Response(JSON.stringify(e), { status: 500 })
      }
    }
  }
}

async function handleFetchEvent(
  req: Request,
  env: Env,
  ctx: ExecutionContext,
  data: Record<string, any>
): Promise<Response> {
  const url = new URL(req.url)
  // const res = new Response('');
  const res = new Response('', { cf: req.cf })
  const path = url.pathname
  let resp
  const logger = getLogger({
    isSsr: env.SSR,
    nodeEnv: env.NODE_ENV,
    envLogLevel: env.VITE_LOG_LEVEL
  })
  req.logger = logger
  switch (true) {
    case isAssetURL(url):
      // must early return or assets missing
      resp = await handleStaticAssets(req, env, ctx)
      break
    case isAPiURL(url):
      req.logger.child({
        correlationId: getCorrelationId(req.headers),
        isApiURL: isAPiURL(url)
      })
      logger.info(`[api] [index] [handleApiRequest] -> ${req.method} -> ${path}`)
      resp = await Api.handle({ req, res, env, ctx, data })
      logger.info(`[api] [isAPiURL] index.handleFetchEvent -> api response`)
      logger.debug(res.body)
      // logObjs([res.headers, res.body]);
      // console.log(await res.clone().json());
      break
    default:
      req.logger.child({
        correlationId: getCorrelationId(req.headers),
        isAPiURL: isAPiURL(url)
      })
      logger.info(`[api] [default] index.handleFetchEvent -> ${url.pathname}`)
      // this is only logged on page reload due to client routing
      // log(
      //   `[api] handleFetchEvent ${url.pathname} is SSR ${isSSR(
      //     url,
      //     env.SSR_BASE_PATHS.split(',')
      //   )}`
      // );
      resp = (await handleSsr(req, res, env, ctx)) ?? new Response('Not Found', { status: 404 })
  }
  logWorkerEnd(req, resp)
  return resp
}
