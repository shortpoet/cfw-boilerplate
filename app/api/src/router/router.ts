import { RequestLike, IRequest, error, createCors } from 'itty-router'
import { ExecutionContext } from '@cloudflare/workers-types'
import { ServerResponse } from 'http'
import { OpenAPIRouter } from '@cloudflare/itty-router-openapi'

import {
  // auth as authMiddleware,
  withSession,
  withCfHeaders,
  withCfSummary,
  withPino,
  withQueryParams,
  withListOptions,
  withDb
  // withUser,
} from '../middleware'

import { health_router, task_router, auth_router, misc_router } from '#/api/src/router'
import withCookies from '../middleware/cookie'
import { LUCIA_AUTH_COOKIES_SESSION_TOKEN } from '#/types'
// import { createCors } from '../middleware/createCors';
task_router
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
  openapiVersion: '3.1',
  raiseUnknownParameters: false
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

// GET collection index
router
  .all('*', preflight)
  .all('*', withPino({ level: FILE_LOG_LEVEL }), withDb(), withCookies())
  .all('*', withCfSummary(), withCfHeaders(), withQueryParams(), withListOptions(), withSession())
  .all('/auth/*', auth_router)
  .all('/task/*', task_router)
  .all('/health/*', health_router)
  .all('*', misc_router)
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
      console.log(`[api] [router] -> has data`)
      console.log(data)
      out = router.handle(req, res, env, ctx, data).catch(error).then(corsify)
    } else {
      console.log(`[api] [router] -> no data`)
      out = router.handle(req, res, env, ctx).catch(error).then(corsify)
    }
    return out
  }
}

export default Api
