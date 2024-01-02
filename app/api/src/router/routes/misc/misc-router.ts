import { IRequest } from 'itty-router'
import { OpenAPIRouter } from '@cloudflare/itty-router-openapi'

import sampleData from '##/db/data.json'
import { HelloPost } from './handlers/hello-handler'
import { jsonOkResponse } from '#/api/src/middleware'

const TODOS = Array.from({ length: 8 }, (_, i) => i + 1).map((id) => ({
  id,
  title: `Todo #${id}`
}))

type CF = [env: Env, ctx: ExecutionContext, data: Record<string, any>]

const router = OpenAPIRouter<IRequest, CF>({ base: '/api' })

router
  .get('/json-data', (req: IRequest, res: Response, env: Env, ctx: ExecutionContext) => {
    console.log(`[api] /json-data -> ${req.method} -> ${req.url} -> req`)
    console.log(sampleData)
    return jsonOkResponse(sampleData, res)
  })
  .get(
    '/hello',
    // withCfSummary(),
    // withUser(),
    (req: IRequest, res: Response, env: Env, ctx: ExecutionContext) => {
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
    }
  )

  .post(
    '/hello',
    async (
      req: IRequest,
      res: Response,
      env: Env,
      ctx: ExecutionContext,
      data: Record<string, any>
    ) => {
      console.log(`[api] /hello -> ${req.method} -> ${req.url} -> data`)
      console.log(data)
      console.log(`[api] /hello -> ${req.method} -> ${req.url} -> req data`)
      let json
      let text
      try {
        json = await req.clone().json()
        console.log(json)
      } catch (error) {
        console.error(error)
        text = await req.clone().text()
        console.log(text)
      }

      return jsonOkResponse({ data, json, text }, res)
    }
  )

  .post('/hola-clase', HelloPost)

  .get('/todos', (req: IRequest, res: Response, env: Env, ctx: ExecutionContext) => {
    return jsonOkResponse(TODOS, res)
  })

router.registry.registerPath({
  tags: ['misc'],
  method: 'post',
  path: '/api/hello',
  description: 'Hello world',
  summary: 'Test data in and out',
  // request: {
  //   params: z.object({ id: UserIdSchema })
  // },
  requestBody: {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            hello: { type: 'string' }
          }
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Object with hello world data',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              hello: { type: 'string' }
            }
          }
        }
      }
    },
    204: {
      description: 'No content - successful operation'
    }
  }
})

export default router
