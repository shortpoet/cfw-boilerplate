import { OpenAPIRoute, OpenAPIRouteSchema, Path } from '@cloudflare/itty-router-openapi'
import { Task } from './types'
import { ALL_TASKS } from './taskList'
import { badResponse, notFoundResponse, serverErrorResponse } from '#/api/src/middleware'
import { GetTaskSchema } from '../task-schema'

export class TaskFetch extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = GetTaskSchema

  async handle(
    req: Request,
    res: Response,
    env: Env,
    ctx: ExecutionContext,
    data: Record<string, any>
  ) {
    // Retrieve the validated slug
    const { taskId: id } = data.params
    let task
    try {
      task = ALL_TASKS.find((task) => task.id === id)
      if (!task) return notFoundResponse('Task not found', undefined, res)
      return {
        success: true,
        task
      }
    } catch (error) {
      console.log(error)
      return serverErrorResponse('Error fetching task', error, res)
    }
  }
}
