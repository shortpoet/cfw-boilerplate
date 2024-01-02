import { jsonOkResponse, serverErrorResponse } from '#/api/src/middleware'
import { OpenAPIRoute, OpenAPIRouteSchema } from '@cloudflare/itty-router-openapi'
import { HealthGetSchema } from '../health-schema'

import { isWorker, getManifest } from './util'
import { HealthCheck } from '#/types'
import { msToTime } from '#/utils'

export const healthRes = async (env: Env) => {
  return healthRes
}

export class HealthGet extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = HealthGetSchema

  async handle(
    req: Request,
    res: Response,
    env: Env,
    ctx: ExecutionContext,
    data: Record<string, any>
  ) {
    try {
      console.log(`[api] [HealthGet] -> ${req.method} -> ${req.url} -> req`)
      console.log(data)

      const hasNamespace = env.CFW_BOILERPLATE_UI !== undefined
      let gitInfo
      try {
        gitInfo =
          isWorker() && hasNamespace
            ? JSON.parse((await (env.CFW_BOILERPLATE_UI as KVNamespace).get('gitInfo')) || '')
            : (await import('#/api/db/git.json')).default
      } catch (error) {
        console.error(`[api] [controllers] [health] [healthRes] gitInfo error: ${error}`)
      }

      let uptime = '0'
      try {
        uptime = msToTime(process.uptime())
      } catch (error) {
        console.error(`[api] [controllers] [health] [healthRes] uptime error: ${error}`)
      }

      const healthRes: HealthCheck = {
        status: 'OK',
        version: await getManifest(env),
        uptime,
        worker_env: env.WORKER_ENVIRONMENT,
        timestamp: new Date(Date.now()),
        gitInfo: gitInfo
      }

      return jsonOkResponse(healthRes, res)
    } catch (error) {
      console.error(error)
      return serverErrorResponse('Error getting users', error, res)
    }
  }
}
