/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Session = {
  /**
   * Session ID
   */
  sessionId: string;
  user: {
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
  /**
   * Session expiry date
   */
  activePeriodExpiresAt: string;
  /**
   * Session expiry date
   */
  idlePeriodExpiresAt: string;
  /**
   * Session state
   */
  state: string;
  /**
   * Is session fresh
   */
  fresh: boolean;
};

