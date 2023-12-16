import { ExecutionContext } from '@cloudflare/workers-types';
import { MethodNotAllowedError, NotFoundError } from '@cloudflare/kv-asset-handler/dist/types';
import { isAPiURL, isAssetURL, isSSR, logObjs, logWorkerEnd, logWorkerStart } from '#/utils';
import { Api, corsify } from './router';
import { handleStaticAssets } from './static-assets';
import { handleSsr } from './ssr';

const FILE_LOG_LEVEL = 'debug';
import { getCorrelationId, getLogger } from '#/utils/logger/logger';

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
    data: Record<string, any>
  ): Promise<Response> {
    try {
      logWorkerStart(request);
      return await handleFetchEvent(request, env, ctx, data);
    } catch (e) {
      console.error(e);
      if (e instanceof NotFoundError) {
        return new Response('Not Found', { status: 404 });
      } else if (e instanceof MethodNotAllowedError) {
        return new Response('Method Not Allowed', { status: 405 });
      } else {
        return new Response(JSON.stringify(e), { status: 500 });
      }
    }
  },
};

async function handleFetchEvent(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  data: Record<string, any>
): Promise<Response> {
  const url = new URL(request.url);
  // const resp = new Response('');
  const resp = new Response('', { cf: request.cf });
  const path = url.pathname;
  let res;
  const logger = getLogger({ env }).child({ correlationId: getCorrelationId() });
  logger.info(`[api] index.handleFetchEvent -> ${request.method} -> ${path}`);
  switch (true) {
    case isAssetURL(url):
      // must early return or assets missing
      res = await handleStaticAssets(request, env, ctx);
      break;
    case isAPiURL(url):
      // console.log(
      //   `[api] [isAPiURL] index.handleFetchEvent -> ${env.VITE_API_VERSION} -> ${url.pathname}`
      // );
      res = await Api.handle(request, resp, env, ctx, data);
      logger.info(`[api] [isAPiURL] index.handleFetchEvent -> api response`);
      // logObjs([res.headers, res.body]);
      // console.log(await res.clone().json());
      break;
    default:
      console.log(`[api] [default] index.handleFetchEvent -> ${url.pathname}`);
      // this is only logged on page reload due to client routing
      // log(
      //   `[api] handleFetchEvent ${url.pathname} is SSR ${isSSR(
      //     url,
      //     env.SSR_BASE_PATHS.split(',')
      //   )}`
      // );
      res =
        (await handleSsr(request, resp, env, ctx)) ?? new Response('Not Found', { status: 404 });
  }
  logWorkerEnd(request, res);
  return res;
}
