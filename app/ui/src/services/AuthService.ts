/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthLoginEmailBody } from '../models/AuthLoginEmailBody';
import type { AuthLoginUsernameBody } from '../models/AuthLoginUsernameBody';
import type { AuthRegisterBody } from '../models/AuthRegisterBody';
import type { Session } from '../models/Session';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AuthService {

  /**
   * Log in via your email and password
   * @returns Session User Object
   * @throws ApiError
   */
  public static postLoginPasswordUser({
    requestBody,
  }: {
    requestBody?: (AuthLoginEmailBody | AuthLoginUsernameBody),
  }): CancelablePromise<Session> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/auth/login/password',
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * Register a new user via email and password
   * @returns Session User Object
   * @throws ApiError
   */
  public static postRegisterPasswordUser({
    requestBody,
  }: {
    requestBody?: AuthRegisterBody,
  }): CancelablePromise<Session> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/auth/register/password',
      body: requestBody,
      mediaType: 'application/json',
    });
  }

}
