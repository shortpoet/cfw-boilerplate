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
  public static getGithub(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/auth/login/github',
    });
  }

  /**
   * @returns any Object with user data.
   * @throws ApiError
   */
  public static getGithubCallback(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/auth/login/github/callback',
    });
  }

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
  public static getLogout(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/auth//logout',
    });
  }

  /**
   * @returns any Object with user data.
   * @throws ApiError
   */
  public static getFind(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/db-v1/find',
    });
  }

  /**
   * @returns any Object with user data.
   * @throws ApiError
   */
  public static getDebug(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/health/debug',
    });
  }

  /**
   * @returns any Object with user data.
   * @throws ApiError
   */
  public static postDebug(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/health/debug',
    });
  }

  /**
   * @returns any Object with user data.
   * @throws ApiError
   */
  public static getCheck(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/health/check',
    });
  }

  /**
   * @returns any Object with user data.
   * @throws ApiError
   */
  public static postCheck(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/health/check',
    });
  }

  /**
   * @returns any Object with user data.
   * @throws ApiError
   */
  public static getCheck2(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/health/check2',
    });
  }

  /**
   * @returns any Object with user data.
   * @throws ApiError
   */
  public static getCheckRoot(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/health/check-root',
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
