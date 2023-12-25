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
