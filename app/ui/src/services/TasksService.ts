/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Task } from '../models/Task';
import type { TaskListResponse } from '../models/TaskListResponse';
import type { TaskResponse } from '../models/TaskResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

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
    cursor,
  }: {
    page: number,
    limit?: number,
    isCompleted?: boolean,
    cursor?: string,
  }): CancelablePromise<TaskListResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/task/tasks',
      query: {
        'page': page,
        'limit': limit,
        'isCompleted': isCompleted,
        'cursor': cursor,
      },
    });
  }

  /**
   * Create a new Task
   * @returns any Returns the created task
   * @throws ApiError
   */
  public static postTaskCreate({
    requestBody,
  }: {
    requestBody?: Task,
  }): CancelablePromise<{
    success: boolean;
    result: {
      task: Task;
    };
  }> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/task/tasks',
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * Get a single Task by id
   * @returns TaskResponse Returns a single task if found
   * @throws ApiError
   */
  public static getTaskFetch({
    taskId,
  }: {
    taskId: string,
  }): CancelablePromise<TaskResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/task/tasks/{taskId}',
      path: {
        'taskId': taskId,
      },
      errors: {
        404: `Task not found`,
        500: `Internal server error`,
      },
    });
  }

  /**
   * Delete a Task
   * @returns any Returns if the task was deleted successfully
   * @throws ApiError
   */
  public static deleteTaskDelete({
    taskSlug,
  }: {
    taskSlug: string,
  }): CancelablePromise<{
    success: boolean;
    result: {
      task: Task;
    };
  }> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/task/tasks/{taskId}',
      path: {
        'taskSlug': taskSlug,
      },
    });
  }

}
