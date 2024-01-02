import { IRequest } from 'itty-router'
import { OpenAPIRouter } from '@cloudflare/itty-router-openapi'
import { RegisterPasswordUser } from './handlers/login-password-handler'

type CF = [env: Env, ctx: ExecutionContext, data: Record<string, any>]

const router = OpenAPIRouter<IRequest, CF>({ base: '/api/auth/register' })

router.post('/password', RegisterPasswordUser)

export default router
