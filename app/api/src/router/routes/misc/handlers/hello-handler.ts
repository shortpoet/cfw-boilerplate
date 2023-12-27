import { jsonOkResponse, serverErrorResponse } from '#/api/src/middleware'
import { OpenAPIRoute, OpenAPIRouteSchema } from '@cloudflare/itty-router-openapi'
import { GetHelloPostSchema } from '../misc-schema'

export class HelloPost extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = GetHelloPostSchema

  async handle(
    req: Request,
    res: Response,
    env: Env,
    ctx: ExecutionContext,
    data: Record<string, any>
  ) {
    try {
      console.log(`[api] /hello -> ${req.method} -> ${req.url} -> req`)
      console.log(data)
      return jsonOkResponse(data, res)
    } catch (error) {
      console.error(error)
      return serverErrorResponse('Error getting users', error, res)
    }
  }
}
