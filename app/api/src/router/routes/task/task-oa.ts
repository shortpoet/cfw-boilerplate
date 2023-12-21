import { Int, Path, Query, DateTime, Str } from '@cloudflare/itty-router-openapi';
import { z } from 'zod';

export const TaskComponent = z
  .object({
    name: z.string().openapi({ example: 'Clean my room' }),
    slug: z.string(),
    description: z.string().optional(),
    completed: z.boolean(),
    due_date: z.string().datetime(),
  })
  .openapi('Task');
export type TaskComponentType = z.infer<typeof TaskComponent>;

export const TaskListResponseComponent = z
  .object({
    success: z.boolean(),
    page: z.number(),
    isCompleted: z.boolean().optional(),
    tasks: z.array(TaskComponent),
  })
  .openapi('TaskListResponse');
export type TaskListResponseComponentType = z.infer<typeof TaskListResponseComponent>;

export const GetTaskSchema = {
  tags: ['Tasks'],
  summary: 'List Tasks',
  parameters: {
    page: Query(Int, { description: 'Page number', default: 0 }),
    isCompleted: Query(Boolean, { description: 'Filter by completed flag', required: false }),
  },
  responses: {
    '200': {
      description: 'Returns a list of tasks',
      schema: TaskListResponseComponent,
    },
  },
};