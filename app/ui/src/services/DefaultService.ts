/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DefaultService {

  /**
   * @returns any Object with user data.
   * @throws ApiError
   */
  public static get(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/auth/session',
    });
  }

  /**
   * @returns any Object with user data.
   * @throws ApiError
   */
  public static getAll(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/auth/session/all',
    });
  }

  /**
   * @returns any Object with user data.
   * @throws ApiError
   */
  public static getLogout(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/auth/logout',
    });
  }

  /**
   * @returns any Object with user data.
   * @throws ApiError
   */
  public static getJsonData(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/json-data',
    });
  }

  /**
   * @returns any Object with user data.
   * @throws ApiError
   */
  public static getHello(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/hello',
    });
  }

  /**
   * @returns any Object with user data.
   * @throws ApiError
   */
  public static getTodos(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/todos',
    });
  }

}
