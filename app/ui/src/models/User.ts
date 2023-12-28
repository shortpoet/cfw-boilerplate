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
  roles: Array<'not_set' | 'guest' | 'admin' | 'user'>;
  userTypes: Array<'not_set' | 'email' | 'github' | 'credentials'>;
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

