import { jsonOkResponse, serverErrorResponse } from '#/api/src/middleware'
import { OpenAPIRoute, OpenAPIRouteSchema } from '@cloudflare/itty-router-openapi'
import {
  MiscDumpPostSchema,
  MiscHelloGetSchema,
  MiscHelloPostSchema,
  MiscSampleDataGetSchema,
  MiscTodosGetSchema
} from '../misc-schema'
import sampleData from '##/db/data.json'

export class MiscJsonDataGet extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = MiscSampleDataGetSchema
  async handle(req: Request, res: Response, env: Env, ctx: ExecutionContext) {
    try {
      return jsonOkResponse(sampleData, res)
    } catch (error) {
      console.error(error)
      return serverErrorResponse('Error getting users', error, res)
    }
  }
}
export class MiscTodosGet extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = MiscTodosGetSchema

  async handle(req: Request, res: Response, env: Env, ctx: ExecutionContext) {
    try {
      return jsonOkResponse(
        Array.from({ length: 8 }, (_, i) => i + 1).map((id) => ({
          id,
          title: `Todo #${id}`,
          completed: Math.random() > 0.5
        })),
        res
      )
    } catch (error) {
      console.error(error)
      return serverErrorResponse('Error getting users', error, res)
    }
  }
}

export class MiscHelloGet extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = MiscHelloGetSchema

  async handle(req: Request, res: Response, env: Env, ctx: ExecutionContext) {
    try {
      res.cookie(req, res, env, 'hello', 'world', {
        httpOnly: false,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
      res.headers.set('x-hello', 'world')
      // added path `/api` to cookie in firefox
      // also 'session' to max-age
      res.headers.set('Set-Cookie', 'hello=world; SameSite=Lax')
      return jsonOkResponse({ hello: 'world' }, res)
    } catch (error) {
      console.error(error)
      return serverErrorResponse('Error getting users', error, res)
    }
  }
}

export class MiscHelloPost extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = MiscHelloPostSchema

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

export class MiscPost extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = MiscDumpPostSchema

  async handle(
    req: Request,
    res: Response,
    env: Env,
    ctx: ExecutionContext,
    data: Record<string, any>
  ) {
    try {
      console.log(`[api] [misc] -> ${req.method} -> ${req.url} -> data`)
      console.log(data)
      // const {query, params} = data
      return jsonOkResponse({ data }, res)
    } catch (error) {
      console.error(error)
      return serverErrorResponse(undefined, error, res)
    }
  }
}
