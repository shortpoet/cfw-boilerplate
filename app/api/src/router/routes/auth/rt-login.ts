import { IRequest } from 'itty-router'
import { OpenAPIRouter } from '@cloudflare/itty-router-openapi'
import { LoginPasswordUser } from './handlers/login-password-handler'
import { LoginOauth, LoginOauthCallback } from './handlers/login-oauth-handler'

type CF = [env: Env, ctx: ExecutionContext, data: Record<string, any>]

const router = OpenAPIRouter<IRequest, CF>({ base: '/api/auth/login' })

router.post('/password', LoginPasswordUser)

router.get('/oauth', LoginOauth)

router.get('/oauth/callback', LoginOauthCallback)

export default router
