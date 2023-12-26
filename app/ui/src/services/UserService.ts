/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { User } from '../models/User';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class UserService {

  /**
   * Gets a list of all users.
   * @returns User List of all users
   * @throws ApiError
   */
  public static getGetUsers(): CancelablePromise<Array<User>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/auth/user/all',
      errors: {
        404: `Users not found`,
        500: `Internal server error`,
      },
    });
  }

}
