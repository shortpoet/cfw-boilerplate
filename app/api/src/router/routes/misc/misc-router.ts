import { IRequest } from 'itty-router'
import { OpenAPIRouter } from '@cloudflare/itty-router-openapi'
import { jsonData } from '#/api/src/middleware'

import sampleData from '##/db/data.json'
import { HelloPost } from './handlers/hello-handler'
// const sampleData = {
//   hello: 'world',
// };
const todos = Array.from({ length: 8 }, (_, i) => i + 1).map((id) => ({
  id,
  title: `Todo #${id}`
}))

type CF = [env: Env, ctx: ExecutionContext, data: Record<string, any>]

const router = OpenAPIRouter<IRequest, CF>({ base: '/api' })

router
  .get('/json-data', (req: IRequest, res: Response, env: Env, ctx: ExecutionContext) => {
    console.log(`[api] /json-data -> ${req.method} -> ${req.url} -> req`)
    console.log(sampleData)
    return jsonData(req, res, env, sampleData)
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
      return jsonData(req, res, env, { hello: 'world' })
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
      try {
        const json = await req.clone().json()
        console.log(json)
      } catch (error) {
        console.error(error)
        const text = await req.clone().text()
        console.log(text)
      }

      return jsonData(req, res, env, data)
    }
  )

  .post('/hola-clase', HelloPost)

  .get('/todos', (req: IRequest, res: Response, env: Env, ctx: ExecutionContext) => {
    return jsonData(req, res, env, todos)
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
