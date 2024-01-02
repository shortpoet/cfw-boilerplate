import { z } from 'zod'

export const TaskSchema = z.object({
  id: z.string(),
  name: z.string().openapi({ example: 'Clean my room' }),
  slug: z.string(),
  description: z.string().optional(),
  completed: z.boolean(),
  due_date: z.string().datetime()
})
export type Task = z.infer<typeof TaskSchema>

export const TaskListResponseSchema = z.object({
  success: z.boolean(),
  page: z.number(),
  isCompleted: z.boolean().optional(),
  tasks: z.array(TaskSchema)
})
export type TaskListResponse = z.infer<typeof TaskListResponseSchema>

export const TaskResponseSchema = z.object({
  success: z.boolean(),
  task: TaskSchema
})
export type TaskResponse = z.infer<typeof TaskResponseSchema>
