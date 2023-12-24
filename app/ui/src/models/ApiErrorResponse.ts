/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ApiErrorResponse = {
  success: boolean;
  error: {
    message: string;
    type: string;
    code: number;
    stack?: string;
    cause?: string;
  };
};

