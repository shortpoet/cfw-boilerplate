/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type User = {
  /**
   * User ID
   */
  userId: string;
  /**
   * User's username
   */
  username: string;
  userType: User.userType;
  roles: Array<'admin' | 'user' | 'guest' | 'not_set'>;
  /**
   * Is user email verified
   */
  email_verified: boolean;
  /**
   * User email
   */
  email?: string;
  /**
   * User avatar URL
   */
  avatar_url?: string;
  /**
   * User's name
   */
  name?: string;
  /**
   * User password
   */
  password?: string;
};

export namespace User {

  export enum userType {
    NOT_SET = 'not_set',
    CREDENTIALS = 'credentials',
    GITHUB = 'github',
    EMAIL = 'email',
  }


}

