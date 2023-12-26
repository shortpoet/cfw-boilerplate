/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Session } from '../models/Session';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AuthService {

  /**
   * Register a new user
   * @returns Session User Object
   * @throws ApiError
   */
  public static postRegisterPasswordUser({
    requestBody,
  }: {
    requestBody?: {
      username: string;
      email: string;
      password: string;
    },
  }): CancelablePromise<Session> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/auth/login/password',
      body: requestBody,
      mediaType: 'application/json',
    });
  }

}
