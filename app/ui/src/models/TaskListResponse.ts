/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Task } from './Task';

export type TaskListResponse = {
  success: boolean;
  page: number;
  isCompleted?: boolean;
  tasks: Array<Task>;
};
