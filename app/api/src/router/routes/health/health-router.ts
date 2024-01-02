import { IRequest } from 'itty-router'
import { OpenAPIRouter } from '@cloudflare/itty-router-openapi'

import { HealthGet } from './handlers/health'
import { DebugGet } from './handlers/debug'

type CF = [env: Env, context: ExecutionContext]
const router = OpenAPIRouter<IRequest, CF>({ base: '/api/health' })

router.all('/', () => new Response(JSON.stringify({ ping: 'pong' })))

router.get('/check', HealthGet)

router.get(
  '/debug',
  // withAuth({ roles: [UserRole.Admin] }),
  DebugGet
)
// router.post(
//   '/debug',
//   // withAuth({ roles: [UserRole.Admin] }),
//   async (req: Request, res: Response, env: Env, ctx: ExecutionContext) => {
//     const log = logger(FILE_LOG_LEVEL, env);
//     const debugResponse = await debugRes(req, res, env, ctx, false);
//     log(`[api] [routes] [health] [debug] POST -> debugResponse ->`);
//     // logObjs([debugResponse]);
//     return jsonData(req, res, env, debugResponse);
//   }
// );

// router.all("*", () => error(404, "Are you sure about that?"));

export default router
