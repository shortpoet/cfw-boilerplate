/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthLoginEmailBody } from '../models/AuthLoginEmailBody';
import type { AuthLoginResponse } from '../models/AuthLoginResponse';
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
   * @returns AuthLoginResponse Redirect URL
   * @throws ApiError
   */
  public static postLoginPasswordUser({
    requestBody,
  }: {
    requestBody?: (AuthLoginEmailBody | AuthLoginUsernameBody),
  }): CancelablePromise<AuthLoginResponse> {
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
  public static getLoginOauth({
    provider,
    redirectUrl,
  }: {
    provider: string,
    redirectUrl?: string,
  }): CancelablePromise<OauthLoginResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/auth/login/oauth',
      query: {
        'provider': provider,
        'redirect_url': redirectUrl,
      },
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
  public static getLoginOauthCallback({
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
   * Log in via OAuth callback
   * @returns Session Successful OAuth login - session
   * @throws ApiError
   */
  public static getLoginOauthCallback1({
    code,
    state,
  }: {
    code: string,
    state: string,
  }): CancelablePromise<Session> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/auth/login/google/callback',
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
   * @returns AuthLoginResponse Redirect URL
   * @throws ApiError
   */
  public static postRegisterPasswordUser({
    requestBody,
  }: {
    requestBody?: AuthRegisterBody,
  }): CancelablePromise<AuthLoginResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/auth/register/password',
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * Fetch a user session
   * @returns Session Logged in User Session
   * @throws ApiError
   */
  public static getSessionGet(): CancelablePromise<Session> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/auth/session',
      errors: {
        404: `Session not found`,
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Fetch all user sessions
   * @returns Session List of all user sessions
   * @throws ApiError
   */
  public static getSessionsGet(): CancelablePromise<Array<Session>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/auth/session/all',
      errors: {
        404: `Sessions not found`,
        500: `Internal Server Error`,
      },
    });
  }

  /**
   * Log out
   * @returns void
   * @throws ApiError
   */
  public static getLogout(): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/auth/logout',
    });
  }

}
