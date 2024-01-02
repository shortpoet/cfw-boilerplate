import { Task } from './types'
import { OpenAPIRoute, OpenAPIRouteSchema, Query } from '@cloudflare/itty-router-openapi'
import { taskGenerator } from './task-generator'
import { TaskComponentType } from '../task-component'
import { GetTaskListSchema } from '../task-schema'
import { jsonOkResponse } from '#/api/src/middleware'

export const ALL_TASKS: TaskComponentType[] = taskGenerator(134)

export class TaskList extends OpenAPIRoute {
  static schema = GetTaskListSchema

  async handle(
    req: Request,
    res: Response,
    env: Env,
    ctx: ExecutionContext,
    data: Record<string, any>
  ) {
    // Retrieve the validated parameters
    const { page, isCompleted } = data.query

    // Apply list options from middleware
    const listOptions = req.listOptions || {} // Access list options parsed by middleware

    // You can access limit, cursor, and indexKey from listOptions
    const { limit, cursor, indexKey } = listOptions

    console.log(
      `[api] [task-list] [handle] page: ${page}, limit: ${limit}, cursor: ${cursor}, indexKey: ${indexKey}`
    )

    // Assuming you have some data source to fetch tasks

    // Implement pagination logic
    let startIndex = (page - 1) * (limit || 10) // Default limit to 10 if not specified
    // let startIndex = 0;
    let endIndex = startIndex + (limit || 10) // Adjust limit if provided

    if (limit === 0) {
      // If limit is set to 0, retrieve all data without limit
      startIndex = 0
      endIndex = ALL_TASKS.length
    }

    // Implement pagination logic using cursor and indexKey
    if (cursor && indexKey) {
      // Find the index of the cursor value in the dataset
      const index = ALL_TASKS.findIndex(
        (task) => task[indexKey as keyof TaskComponentType] === cursor
      )
      if (index !== -1) {
        // Use the cursor index to calculate the start index for the next page
        startIndex = index + 1
      }
    }

    // Slice the dataset based on the calculated start and end indexes
    const paginatedTasks = ALL_TASKS.slice(startIndex, endIndex)
    // Return paginated tasks along with other metadata
    const out = {
      success: true,
      page,
      isCompleted,
      tasks: paginatedTasks
      // Optionally, you can include metadata like next/previous page links, total count, etc.
    }
    console.log(
      `\n^^^^^^^^\n[api] [task-list] [handle] out count:\n^^^^^^^^\n`,
      out.tasks.length,
      '\n^^^^^^^^\n'
    )
    return jsonOkResponse(
      {
        success: true,
        page,
        isCompleted,
        tasks: paginatedTasks
        // Optionally, you can include metadata like next/previous page links, total count, etc.
      },
      res
    )
  }
}
