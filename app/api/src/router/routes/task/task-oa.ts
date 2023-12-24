import { Int, Path, Query, DateTime, Str } from '@cloudflare/itty-router-openapi'
import { z } from 'zod'

export const TaskComponent = z
  .object({
    id: z.string(),
    name: z.string().openapi({ example: 'Clean my room' }),
    slug: z.string(),
    description: z.string().optional(),
    completed: z.boolean(),
    due_date: z.string().datetime()
  })
  .openapi('Task')
export type TaskComponentType = z.infer<typeof TaskComponent>

export const TaskListResponseComponent = z
  .object({
    success: z.boolean(),
    page: z.number(),
    isCompleted: z.boolean().optional(),
    tasks: z.array(TaskComponent)
  })
  .openapi('TaskListResponse')
export type TaskListResponseComponentType = z.infer<typeof TaskListResponseComponent>

export const TaskResponseComponent = z
  .object({
    success: z.boolean(),
    task: TaskComponent
  })
  .openapi('TaskResponse')
export type TaskResponseComponentType = z.infer<typeof TaskResponseComponent>

export const ApiErrorResponseComponent = z
  .object({
    success: z.boolean(),
    error: z.object({
      message: z.string(),
      type: z.string(),
      code: z.number(),
      stack: z.string().optional(),
      cause: z.string().optional()
    })
  })
  .openapi('ApiErrorResponse')
export type ApiErrorResponseComponentType = z.infer<typeof ApiErrorResponseComponent>

export const GetTaskListSchema = {
  tags: ['Tasks'],
  summary: 'List Tasks',
  parameters: {
    page: Query(Int, { description: 'Page number', default: 1 }), // Update default page to 1
    limit: Query(Int, { description: 'Number of items per page', default: 10, required: false }), // Add limit parameter
    isCompleted: Query(Boolean, { description: 'Filter by completed flag', required: false }),
    cursor: Query(Str, { description: 'Cursor for pagination', required: false }) // Add cursor parameter
  },
  responses: {
    '200': {
      description: 'Returns a list of tasks',
      schema: TaskListResponseComponent
    }
  }
}

export const GetTaskSchema = {
  tags: ['Tasks'],
  summary: 'Get a single Task by id',
  parameters: {
    taskId: Path(String, {
      description: 'Task id'
    })
  },
  responses: {
    '200': {
      description: 'Returns a single task if found',
      schema: TaskResponseComponent
    },
    '404': {
      description: 'Task not found',
      schema: ApiErrorResponseComponent
    },
    '500': {
      description: 'Internal server error',
      schema: ApiErrorResponseComponent
    }
  }
}
