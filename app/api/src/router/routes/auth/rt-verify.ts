import { IRequest } from 'itty-router'
import { OpenAPIRouter } from '@cloudflare/itty-router-openapi'
import { VerificationEmailGet, VerificationTokenGet } from './handlers/email-handler'

type CF = [env: Env, ctx: ExecutionContext, data: Record<string, any>]

const router = OpenAPIRouter<IRequest, CF>({ base: '/api/auth/verify' })

router.get('/email', VerificationEmailGet)

router.get('/token', VerificationTokenGet)

export default router
