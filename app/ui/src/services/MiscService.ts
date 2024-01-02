/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MiscDataRequestComponent } from '../models/MiscDataRequestComponent';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class MiscService {

  /**
   * Sample data test
   * Get sample data
   * @returns any List of sample data
   * @throws ApiError
   */
  public static getMiscJsonDataGet(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/json-data',
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Test data in and out
   * Hello world
   * @returns any Object with hello world data
   * @throws ApiError
   */
  public static getMiscHelloGet(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/hello',
    });
  }

  /**
   * Test data in and out
   * Hello world
   * @returns any Object with hello world data
   * @throws ApiError
   */
  public static postMiscHelloPost({
    requestBody,
  }: {
    requestBody?: {
      content: {
        'application/json': {
          schema: MiscDataRequestComponent;
        };
      };
    },
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/hello',
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * Test data in and out
   * Miscellaneous data dump
   * @returns any Object with hello world data
   * @throws ApiError
   */
  public static postMiscPost({
    requestBody,
  }: {
    requestBody?: {
      content: {
        'application/json': {
          schema: MiscDataRequestComponent;
        };
      };
    },
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/misc',
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * Todos test
   * Get todos
   * @returns any List of todos
   * @throws ApiError
   */
  public static getMiscTodosGet(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/todos',
      errors: {
        500: `Internal Server Error`,
      },
    });
  }

}
