import { IRequest } from 'itty-router'
import { OpenAPIRouter } from '@cloudflare/itty-router-openapi'

import login_router from './rt-login'
import session_router from './rt-session'
import user_router from './rt-user'
import { logout } from './handlers'

type CF = [env: Env, ctx: ExecutionContext]
const router = OpenAPIRouter<IRequest, CF>({ base: '/api/auth/' })

router.all('/login/*', login_router)

router.all('/session/*', session_router)

router.all('/user/*', user_router)

router.get('/logout', async (req: Request, res: Response, env: Env, ctx: ExecutionContext) => {
  req.logger.info(`[api] [auth] [logout]`)
  return await logout(req, res, env, ctx)
})

export default router
