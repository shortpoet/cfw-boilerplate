import { Int, Path, Query, DateTime, Str } from '@cloudflare/itty-router-openapi'
import { ApiErrorResponseComponent } from '../common-oa'

import { TaskListResponseSchema, TaskResponseSchema, TaskSchema } from '#/types'

export const TaskComponent = TaskSchema.openapi('Task')
export const TaskListResponseComponent = TaskListResponseSchema.openapi('TaskListResponse')
export const TaskResponseComponent = TaskResponseSchema.openapi('TaskResponse')

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
