import { Task } from './types'
import { OpenAPIRoute, OpenAPIRouteSchema, Query } from '@cloudflare/itty-router-openapi'
import { GetTaskSchema } from '../task-oa'
import { taskFaker } from './task-faker'
import { TaskComponentType } from '../task-oa'

const allTasks: TaskComponentType[] = [
  {
    id: '1',
    name: 'Clean my room',
    slug: 'clean-room',
    description: undefined,
    completed: false,
    due_date: '2025-01-05'
  },
  {
    id: '2',
    name: 'Build something awesome with Cloudflare Workers',
    slug: 'cloudflare-workers',
    description: 'Lorem Ipsum',
    completed: true,
    due_date: '2022-12-24'
  },
  ...taskFaker(134)
]

export class TaskList extends OpenAPIRoute {
  static schema = GetTaskSchema

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
      endIndex = allTasks.length
    }

    // Implement pagination logic using cursor and indexKey
    if (cursor && indexKey) {
      // Find the index of the cursor value in the dataset
      const index = allTasks.findIndex(
        (task) => task[indexKey as keyof TaskComponentType] === cursor
      )
      if (index !== -1) {
        // Use the cursor index to calculate the start index for the next page
        startIndex = index + 1
      }
    }

    // Slice the dataset based on the calculated start and end indexes
    const paginatedTasks = allTasks.slice(startIndex, endIndex)
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
    return {
      success: true,
      page,
      isCompleted,
      tasks: paginatedTasks
      // Optionally, you can include metadata like next/previous page links, total count, etc.
    }
  }
}
