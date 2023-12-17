import { UserRole } from '#/types';
import { Generated, GeneratedAlways } from 'kysely';
type AccountId = string;
type UserId = string;
type RoleId = string;
type SessionId = string;

export interface Database {
  User: {
    id: GeneratedAlways<string>;
  };
  UserRole: {
    id: GeneratedAlways<string>;
    role: UserRole;
  };
  UserRoleAssignment: {
    id: GeneratedAlways<string>;
    user_id: UserId;
    roleId: RoleId;
    created_at: Date;
    updated_at: Date;
  };
  UserKey: {
    id: GeneratedAlways<string>;
    user_id: UserId;
    hashed_password: string | null;
  };
  UserSession: {
    id: GeneratedAlways<string>;
    user_id: UserId;
    active_expires: string;
    idle_expires: string;
  };
  D1Migrations: {
    id: Generated<number | null>;
    applied_at: Generated<string>;
    name: string | null;
  };
  // apparently [_kv_cf] is a reserved table name in D1 or maybe it's just the leading underscore
  // _CfKV: {
  //   key: string;
  //   value: Buffer | null;
  // };
}
