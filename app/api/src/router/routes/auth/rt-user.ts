import { IRequest } from 'itty-router'
import { OpenAPIRouter } from '@cloudflare/itty-router-openapi'
import { getAllUsers } from './handlers/user-handler'

type CF = [env: Env, ctx: ExecutionContext]
const router = OpenAPIRouter<IRequest, CF>({ base: '/api/auth/user' })

router.get('/all', async (req: Request, res: Response, env: Env, ctx: ExecutionContext) => {
  console.log(`[api] [auth] [user] [all]`)
  return await getAllUsers(req, res, env, ctx)
})

export default router
