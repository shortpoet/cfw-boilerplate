import { OpenAPIRoute, OpenAPIRouteSchema } from '@cloudflare/itty-router-openapi'
import { TaskComponent } from '../task-schema'

export class TaskCreate extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    tags: ['Tasks'],
    summary: 'Create a new Task',
    requestBody: TaskComponent,
    responses: {
      '200': {
        description: 'Returns the created task',
        schema: {
          success: Boolean,
          result: {
            task: TaskComponent
          }
        }
      }
    }
  }

  async handle(
    req: Request,
    res: Response,
    env: Env,
    ctx: ExecutionContext,
    data: Record<string, any>
  ) {
    // Retrieve the validated request body
    const taskToCreate = data.body

    // Implement your own object insertion here

    // return the new task
    return {
      success: true,
      task: {
        name: taskToCreate.name,
        slug: taskToCreate.slug,
        description: taskToCreate.description,
        completed: taskToCreate.completed,
        due_date: taskToCreate.due_date
      }
    }
  }
}
