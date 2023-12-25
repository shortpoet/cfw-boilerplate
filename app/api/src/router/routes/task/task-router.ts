import { IRequest } from 'itty-router'
import { OpenAPIRouter } from '@cloudflare/itty-router-openapi'
import { TaskCreate, TaskDelete, TaskFetch, TaskList } from './handlers'

type CF = [env: Env, ctx: ExecutionContext, data: Record<string, any>]

const router = OpenAPIRouter<IRequest, CF>({ base: '/api/task' })

router.get('/tasks', TaskList)
router.post('/tasks/', TaskCreate)
router.get('/tasks/:taskId/', TaskFetch)
router.delete('/tasks/:taskId/', TaskDelete)

export default router
