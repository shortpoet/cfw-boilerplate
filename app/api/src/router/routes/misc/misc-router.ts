import { IRequest } from 'itty-router'
import { OpenAPIRouter } from '@cloudflare/itty-router-openapi'

import {
  MiscHelloPost,
  MiscHelloGet,
  MiscPost,
  MiscTodosGet,
  MiscJsonDataGet
} from './handlers/hello-handler'

type CF = [env: Env, ctx: ExecutionContext, data: Record<string, any>]

const router = OpenAPIRouter<IRequest, CF>({ base: '/api' })

router
  .get('/json-data', MiscJsonDataGet)
  .get(
    '/hello',
    // withCfSummary(),
    // withUser(),
    MiscHelloGet
  )

  .post('/misc', MiscPost)

  .post('/hello', MiscHelloPost)

  .get('/todos', MiscTodosGet)

// router.registry.registerPath({
//   tags: ['misc'],
//   method: 'post',
//   path: '/api/hello',
//   description: 'Hello world',
//   summary: 'Test data in and out',
//   // request: {
//   //   params: z.object({ id: UserIdSchema })
//   // },
//   requestBody: {
//     content: {
//       'application/json': {
//         schema: {
//           type: 'object',
//           properties: {
//             hello: { type: 'string' }
//           }
//         }
//       }
//     }
//   },
//   responses: {
//     200: {
//       description: 'Object with hello world data',
//       content: {
//         'application/json': {
//           schema: {
//             type: 'object',
//             properties: {
//               hello: { type: 'string' }
//             }
//           }
//         }
//       }
//     },
//     204: {
//       description: 'No content - successful operation'
//     }
//   }
// })

export default router
