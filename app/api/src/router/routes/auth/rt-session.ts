import { IRequest } from 'itty-router'
import { OpenAPIRouter } from '@cloudflare/itty-router-openapi'
import { SessionGet, SessionsGet } from './handlers'

type CF = [env: Env, ctx: ExecutionContext]

const router = OpenAPIRouter<IRequest, CF>({ base: '/api/auth/session' })

router.get('/', SessionGet)

router.get('/all', SessionsGet)

export default router
