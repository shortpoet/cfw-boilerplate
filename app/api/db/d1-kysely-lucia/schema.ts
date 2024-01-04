import { UserRole } from '#/types'
import { Generated, GeneratedAlways, Insertable, Selectable, Updateable } from 'kysely'
import { Lucia } from '#/bindings'

type AccountId = string
type UserId = string
type RoleId = string
type SessionId = string

export type SelectUser = Selectable<CFWDatabase['User']>
export type UpdateUser = Updateable<CFWDatabase['User']>
export type InsertUser = Insertable<CFWDatabase['User']>

export type SelectSession = Selectable<CFWDatabase['UserSession']>

export interface CFWDatabase {
  User: {
    id: GeneratedAlways<string>
    username: string
    role_flags: number
    user_type_flags: number
    email?: string
    name?: string
    password?: string
  } & Lucia.DatabaseUserAttributes
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
  VerificationCode: {
    id: GeneratedAlways<string>
    user_id: UserId
    code: string
    expires: number
  }
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
