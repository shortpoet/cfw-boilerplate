/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DebugWorkerResponseComponent } from '../models/DebugWorkerResponseComponent';
import type { HealthCheckResponseComponent } from '../models/HealthCheckResponseComponent';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class HealthService {

  /**
   * Get health check
   * @returns HealthCheckResponseComponent Returns health check
   * @throws ApiError
   */
  public static getHealthGet(): CancelablePromise<HealthCheckResponseComponent> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/health/check',
      errors: {
        404: `Health check not found`,
        500: `Internal server error`,
      },
    });
  }

  /**
   * Get debug info
   * @returns DebugWorkerResponseComponent Returns debug info
   * @throws ApiError
   */
  public static getDebugGet({
    parse,
  }: {
    parse?: boolean,
  }): CancelablePromise<DebugWorkerResponseComponent> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/health/debug',
      query: {
        'parse': parse,
      },
      errors: {
        404: `Debug info not found`,
        500: `Internal server error`,
      },
    });
  }

}
