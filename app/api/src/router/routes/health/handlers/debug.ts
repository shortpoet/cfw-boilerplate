import { escapeNestedKeys } from '#/utils'
import { ExecutionContext, KVNamespace } from '@cloudflare/workers-types'
import { getManifest, parseEnv } from './util'
import { jsonOkResponse, serverErrorResponse } from '#/api/src/middleware'
import { OpenAPIRoute, OpenAPIRouteSchema } from '@cloudflare/itty-router-openapi'
import { DebugGetSchema } from '../health-schema'

export class DebugGet extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = DebugGetSchema

  async handle(
    req: Request,
    res: Response,
    env: Env,
    ctx: ExecutionContext,
    data: Record<string, any>
  ) {
    try {
      req.logger.info(`[api] [DebugGet] -> ${req.method} -> ${req.url} -> req`)
      const { parse } = data.query
      const excludes = ['token', 'ADMIN_USERS', 'secret', 'client_id', 'password', 'key']
      let reqLog = escapeNestedKeys(req, excludes)
      let envLog = escapeNestedKeys(env, excludes)

      const out = {
        req: reqLog,
        cf: req.cf,
        // TODO this is expensive, only do it if needed; add a flag to the request using params
        env: parse
          ? {
              ...envLog,
              CFW_BOILERPLATE_UI: await parseEnv(env.CFW_BOILERPLATE_UI as KVNamespace)
              // CFW_BOILERPLATE_KV_USERS: await parseEnv(env.CFW_BOILERPLATE_KV_USERS as KVNamespace),
              // CFW_BOILERPLATE_KV_SESSIONS: await parseEnv(env.CFW_BOILERPLATE_KV_SESSIONS as KVNamespace),
            }
          : envLog,
        ctx,
        rawManifest: await getManifest(env)
      }

      return jsonOkResponse(out, res)
    } catch (error) {
      console.error(error)
      return serverErrorResponse('Error getting users', error, res)
    }
  }
}
