import { IRequest } from 'itty-router'
import { OpenAPIRouter } from '@cloudflare/itty-router-openapi'
import { GetUsers } from './handlers/user-handler'

type CF = [env: Env, ctx: ExecutionContext]
const router = OpenAPIRouter<IRequest, CF>({ base: '/api/auth/user' })

router.get('/all', GetUsers)

export default router
