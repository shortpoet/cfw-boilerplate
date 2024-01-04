import { User } from '#/types'
import { getKysely, getSqlite } from '../derive'
import { SelectUser } from '../schema'
import { querySqliteDatabase } from './util'

export async function getAllUsers(offset?: number, limit?: number): Promise<SelectUser[]> {
  let db = await getKysely()
  let q = db.selectFrom('User').selectAll()
  if (offset) {
    q = q.offset(offset)
  }
  if (limit) {
    q = q.limit(limit)
  }
  return await q.execute()
}

export async function getUserById(id: string): Promise<SelectUser | null> {
  let db = (await getKysely()) || (await getSqlite())
  const result =
    (await db.selectFrom('User').selectAll().where('id', '=', id).executeTakeFirst()) ?? null

  if (!result) return null
  // unfortunately removes typing
  return result
}

export async function getAllUsersLocal(offset?: number, limit?: number): Promise<User[]> {
  // not case sensitive...
  return (await querySqliteDatabase('SELECT * FROM User', offset, limit)) as User[]
}
