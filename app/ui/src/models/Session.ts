/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { User } from './User';

export type Session = {
  /**
   * Session ID
   */
  sessionId: string;
  user: User;
  /**
   * Session expiry date
   */
  activePerdiodExpiresAt: string;
  /**
   * Session expiry date
   */
  idlePerdiodExpiresAt: string;
  /**
   * Session state
   */
  state: string;
  /**
   * Is session fresh
   */
  fresh: boolean;
};

