import { RequestLike, IRequest, error, createCors } from 'itty-router'
import { ExecutionContext } from '@cloudflare/workers-types'
import { ServerResponse } from 'http'
import { OpenAPIRouter } from '@cloudflare/itty-router-openapi'

import sampleData from '##/db/data.json'
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
  withListOptions,
  withDb
  // withUser,
} from '../middleware'

import { auth_dbv1_router } from '#/api/src/router'
import { health_router } from '#/api/src/router'
import { task_router } from '#/api/src/router'
import { auth_router } from '#/api/src/router'
import withCookies from '../middleware/cookie'
import { LUCIA_AUTH_COOKIES_SESSION_TOKEN } from '#/types'
// import { createCors } from '../middleware/createCors';

const FILE_LOG_LEVEL = 'debug'

const { preflight, corsify } = createCors({
  origins: [
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3333',
    'http://localhost:3000',
    'http://localhost:3333',
    'https://cfw-boilerplate.shortpoet.workers.dev',
    'https://cfw-dev.marshmallowmeat.com',
    'https://github.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  headers: {
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, authorization',
    'Access-Control-Allow-Credentials': 'true'
  }
})

export { corsify, router }

type CF = [env: Env, context: ExecutionContext]

const router = OpenAPIRouter<IRequest, CF>({
  schema: {
    info: {
      title: 'CFW Vue AI API',
      version: '1.0'
    }
  },
  base: '/api',
  docs_url: '/docs',
  openapi_url: '/openapi.json',
  redoc_url: '/redoc',
  openapiVersion: '3.1'
})

router.registry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT'
})

router.registry.registerComponent('securitySchemes', 'cookieAuth', {
  type: 'apiKey',
  in: 'cookie',
  name: LUCIA_AUTH_COOKIES_SESSION_TOKEN
})

const protectedRoutes = {
  '/api/health/debug': { route: '/api/health/debug', isAdmin: true }
}
const todos = Array.from({ length: 8 }, (_, i) => i + 1).map((id) => ({
  id,
  title: `Todo #${id}`
}))

// GET collection index
router
  .all('*', preflight)
  .all('*', withPino({ level: FILE_LOG_LEVEL }), withDb(), withCfHeaders())
  .all('*', withQueryParams(), withListOptions(), withCookies(), withSession())
  .all('/auth/*', auth_router)
  .all('/task/*', task_router)
  .all('/db-v1/*', auth_dbv1_router)
  .all('/health/*', health_router)
  .get('/json-data', (req: IRequest, res: Response, env: Env, ctx: ExecutionContext) => {
    console.log(`[api] /json-data -> ${req.method} -> ${req.url} -> req`)
    console.log(sampleData)
    return jsonData(req, res, env, sampleData)
  })
  .get(
    '/hello',
    // withCfSummary(),
    // withUser(),
    (req: IRequest, res: Response, env: Env, ctx: ExecutionContext) => {
      res.cookie(req, res, env, 'hello', 'world', {
        httpOnly: false,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
      res.headers.set('x-hello', 'world')
      // added path `/api` to cookie in firefox
      // also 'session' to max-age
      res.headers.set('Set-Cookie', 'hello=world; SameSite=Lax')
      return jsonData(req, res, env, { hello: 'world' })
    }
  )
  .get('/todos', (req: IRequest, res: Response, env: Env, ctx: ExecutionContext) => {
    return jsonData(req, res, env, todos)
  })
  // .all("*", error_handler)
  .all('*', () => error(404, 'Oops... Are you sure about that? FAaFO'))

const Api = {
  handle: ({
    req,
    res,
    env,
    ctx,
    data
  }: {
    req: Request
    res: Response | ServerResponse
    env: Env
    ctx: ExecutionContext
    data?: Record<string, any>
  }) => {
    let out
    if (data) {
      out = router.handle(req, res, env, ctx, data).catch(error).then(corsify)
    } else {
      out = router.handle(req, res, env, ctx).catch(error).then(corsify)
    }
    return out
  }
}

export default Api
