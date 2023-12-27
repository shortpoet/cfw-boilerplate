/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class MiscService {

  /**
   * Test data in and out
   * Hello world
   * @returns any Object with hello world data
   * @throws ApiError
   */
  public static postApiHello({
    requestBody,
  }: {
    requestBody?: {
      hello?: string;
    },
  }): CancelablePromise<{
    hello?: string;
  }> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/hello',
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * Test data in and out
   * Hello world
   * @returns any Object with hello world data
   * @throws ApiError
   */
  public static postHelloPost({
    requestBody,
  }: {
    requestBody?: {
      content: {
        'application/json': {
          schema: {
            type: string;
            properties: {
              hello: {
                type: string;
              };
            };
          };
        };
      };
    },
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/hola-clase',
      body: requestBody,
      mediaType: 'application/json',
    });
  }

}
