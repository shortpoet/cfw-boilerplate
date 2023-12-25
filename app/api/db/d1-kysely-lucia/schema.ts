import { UserRole } from '#/types'
import { Generated, GeneratedAlways, Insertable, Selectable, Updateable } from 'kysely'
import { Lucia } from '#/bindings'

type AccountId = string
type UserId = string
type RoleId = string
type SessionId = string

export type SelectUser = Selectable<Database['User']>
export type UpdateUser = Updateable<Database['User']>
export type InsertUser = Insertable<Database['User']>

export interface Database {
  User: {
    id: GeneratedAlways<string>
    username: string
    email?: string
    name?: string
    password?: string
  } & Lucia.DatabaseUserAttributes
  UserRole: {
    id: GeneratedAlways<string>
    role: UserRole
  }
  UserRoleAssignment: {
    id: GeneratedAlways<string>
    user_id: UserId
    role_id: RoleId
    created_at: Date
    updated_at: Date
  }
  UserKey: {
    id: GeneratedAlways<string>
    user_id: UserId
    hashed_password: string | null
  }
  UserSession: {
    id: GeneratedAlways<string>
    user_id: UserId
    active_expires: string
    idle_expires: string
    token: string
  } & Lucia.DatabaseSessionAttributes
  D1Migrations: {
    id: Generated<number | null>
    applied_at: Generated<string>
    name: string | null
  }
  // apparently [_kv_cf] is a reserved table name in D1 or maybe it's just the leading underscore
  // _CfKV: {
  //   key: string;
  //   value: Buffer | null;
  // };
}
