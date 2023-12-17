import { createCors, RequestLike, IRequest, error } from 'itty-router';
import { ExecutionContext } from '@cloudflare/workers-types';
import { ServerResponse } from 'http';
import { OpenAPIRouter } from '@cloudflare/itty-router-openapi';

import sampleData from '##/db/data.json';
// const sampleData = {
//   hello: 'world',
// };
import {
  // auth as authMiddleware,
  withSession,
  withCfHeaders,
  withCfSummary,
  jsonData,
  withPino,
  // withUser,
} from '../middleware';

import { auth_dbv1_router } from 'api/router';
import { health_router } from 'api/router';
import { task_router } from 'api/router';
import withCookies from '../middleware/cookie';

const FILE_LOG_LEVEL = 'debug';

const { preflight, corsify } = createCors({
  origins: ['http://localhost:3000', 'https://cfw-boilerplate.pages.dev', 'http://localhost:3333'],
});

export { corsify };

type CF = [env: Env, context: ExecutionContext];

const router = OpenAPIRouter<IRequest, CF>({
  schema: {
    info: {
      title: 'CFW Vue AI API',
      version: '1.0',
    },
  },
  base: '/api',
  docs_url: '/docs',
  openapi_url: '/openapi.json',
});

const protectedRoutes = {
  '/api/health/debug': { route: '/api/health/debug', isAdmin: true },
};

router
  .options('*', preflight)
  .all('*', withPino({ level: FILE_LOG_LEVEL }), withCfHeaders())
  .all('*', withCookies())
  .all('*', withSession())
  // .all('*', withSession())
  .all('/task/*', task_router)
  .all('/db-v1/*', auth_dbv1_router)
  .all('/health/*', health_router)
  .get('/json-data', (req: IRequest, res: Response, env: Env, ctx: ExecutionContext) => {
    console.log(`[api] /json-data -> ${req.method} -> ${req.url} -> req`);
    console.log(sampleData);
    return jsonData(req, res, env, sampleData);
  })
  .get(
    '/hello',
    withCfSummary(),
    // withUser(),
    (req: IRequest, res: Response, env: Env, ctx: ExecutionContext) => {
      res.cookie(req, res, env, 'hello', 'world', { httpOnly: true, secure: false });
      return jsonData(req, res, env, { hello: 'world' });
    }
  )
  // .all("*", error_handler)
  .all('*', () => error(404, 'Oops... Are you sure about that? FAaFO'));

const Api = {
  handle: (
    req: Request,
    resp: Response | ServerResponse,
    env: Env,
    ctx: ExecutionContext,
    data?: Record<string, any>
  ) => {
    let out;
    if (data) {
      out = router.handle(req, resp, env, ctx, data);
    } else {
      out = router.handle(req, resp, env, ctx);
    }
    return out;
  },
};

export default Api;
