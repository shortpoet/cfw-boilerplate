import { RequestLike, IRequest, error, createCors } from 'itty-router';
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
  withQueryParams,
  // withUser,
} from '../middleware';

import { auth_dbv1_router } from '#/api/src/router';
import { health_router } from '#/api/src/router';
import { task_router } from '#/api/src/router';
import { auth_router } from '#/api/src/router';
import withCookies from '../middleware/cookie';
// import { createCors } from '../middleware/createCors';

const FILE_LOG_LEVEL = 'debug';

const { preflight, corsify } = createCors({
  origins: [
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3333',
    'http://localhost:3000',
    'http://localhost:3333',
    'https://cfw-boilerplate.pages.dev',
    'https://github.com',
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  headers: {
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, authorization',
    'Access-Control-Allow-Credentials': 'true',
  },
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
  .all('*', preflight)
  .all('*', withPino({ level: FILE_LOG_LEVEL }), withCfHeaders())
  .all('*', withQueryParams(), withCookies(), withSession())
  .all('/auth/*', auth_router)
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
      out = router.handle(req, resp, env, ctx).catch(error).then(corsify);
    }
    return out;
  },
};

export default Api;
