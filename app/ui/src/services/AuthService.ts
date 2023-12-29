/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthLoginEmailBody } from '../models/AuthLoginEmailBody';
import type { AuthLoginUsernameBody } from '../models/AuthLoginUsernameBody';
import type { AuthRegisterBody } from '../models/AuthRegisterBody';
import type { OauthLoginResponse } from '../models/OauthLoginResponse';
import type { Session } from '../models/Session';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AuthService {

  /**
   * Log in via your email and password
   * @returns Session Logged in User Session
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
   * Log in via OAuth
   * @returns OauthLoginResponse OAuth login URL
   * @throws ApiError
   */
  public static getLoginGithub(): CancelablePromise<OauthLoginResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/auth/login/github',
      errors: {
        302: `Redirect to Request URL`,
      },
    });
  }

  /**
   * Log in via OAuth callback
   * @returns Session Successful OAuth login - session
   * @throws ApiError
   */
  public static getLoginGithubCallback({
    code,
    state,
  }: {
    code: string,
    state: string,
  }): CancelablePromise<Session> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/auth/login/github/callback',
      query: {
        'code': code,
        'state': state,
      },
      errors: {
        400: `Bad Request`,
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Register a new user via email and password
   * @returns Session Logged in User Session
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
