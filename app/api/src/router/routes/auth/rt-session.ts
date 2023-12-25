import { IRequest } from 'itty-router'
import { OpenAPIRouter } from '@cloudflare/itty-router-openapi'
import { session } from './handlers'

type CF = [env: Env, ctx: ExecutionContext]
const router = OpenAPIRouter<IRequest, CF>({ base: '/api/auth/session' })

router.get('/', async (req: Request, res: Response, env: Env, ctx: ExecutionContext) => {
  console.log(`[api] [auth] [session]`)
  return await session(req, res, env, ctx)
})

export default router
