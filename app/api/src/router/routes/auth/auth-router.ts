import { IRequest } from 'itty-router'
import { OpenAPIRouter } from '@cloudflare/itty-router-openapi'

import login_router from './rt-login'
import session_router from './rt-session'
import user_router from './rt-user'
import register_router from './rt-register'
import verify_router from './rt-verify'
import { Logout } from './handlers'

type CF = [env: Env, ctx: ExecutionContext]
const router = OpenAPIRouter<IRequest, CF>({ base: '/api/auth' })

router.all('/login/*', login_router)

router.all('/register/*', register_router)

router.all('/verify/*', verify_router)

router.all('/session/*', session_router)

router.all('/user/*', user_router)

router.get('/logout', Logout)

export default router
