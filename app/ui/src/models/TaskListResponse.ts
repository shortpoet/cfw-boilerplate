/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type TaskListResponse = {
  success: boolean;
  page: number;
  isCompleted?: boolean;
  tasks: Array<{
    id: string;
    name: string;
    slug: string;
    description?: string;
    completed: boolean;
    due_date: string;
  }>;
};

