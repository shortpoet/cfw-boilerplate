/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TaskListResponse } from '../models/TaskListResponse'

import type { CancelablePromise } from '../core/CancelablePromise'
import { OpenAPI } from '../core/OpenAPI'
import { request as __request } from '../core/request'

export class TasksService {
  /**
   * List Tasks
   * @returns TaskListResponse Returns a list of tasks
   * @throws ApiError
   */
  public static getTaskList({
    page,
    limit,
    isCompleted,
    cursor
  }: {
    page: number
    limit?: number
    isCompleted?: boolean
    cursor?: string
  }): CancelablePromise<TaskListResponse> {
    console.log(
      `[ui] [task] [index] [getTaskList] page: ${page}, limit: ${limit}, isCompleted: ${isCompleted}, cursor: ${cursor}`
    )
    const out = __request(OpenAPI, {
      method: 'GET',
      url: '/api/task/tasks',
      query: {
        page: page,
        limit: limit,
        isCompleted: isCompleted,
        cursor: cursor
      }
    })
    return out as CancelablePromise<TaskListResponse>
  }

  /**
   * Create a new Task
   * @returns any Returns the created task
   * @throws ApiError
   */
  public static postTaskCreate({
    requestBody
  }: {
    requestBody?: {
      name: string
      slug: string
      description?: string
      completed: boolean
      due_date: string
    }
  }): CancelablePromise<{
    success: boolean
    result: {
      task: {
        name: string
        slug: string
        description?: string
        completed: boolean
        due_date: string
      }
    }
  }> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/task/tasks',
      body: requestBody,
      mediaType: 'application/json'
    })
  }

  /**
   * Get a single Task by slug
   * @returns any Returns a single task if found
   * @throws ApiError
   */
  public static getTaskFetch({ taskSlug }: { taskSlug: string }): CancelablePromise<{
    success: boolean
    result: {
      task: {
        name: string
        slug: string
        description?: string
        completed: boolean
        due_date: string
      }
    }
  }> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/task/tasks/{taskSlug}',
      path: {
        taskSlug: taskSlug
      },
      errors: {
        404: `Task not found`
      }
    })
  }

  /**
   * Delete a Task
   * @returns any Returns if the task was deleted successfully
   * @throws ApiError
   */
  public static deleteTaskDelete({ taskSlug }: { taskSlug: string }): CancelablePromise<{
    success: boolean
    result: {
      task: {
        name: string
        slug: string
        description?: string
        completed: boolean
        due_date: string
      }
    }
  }> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/task/tasks/{taskSlug}',
      path: {
        taskSlug: taskSlug
      }
    })
  }
}
