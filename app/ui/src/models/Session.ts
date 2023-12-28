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

