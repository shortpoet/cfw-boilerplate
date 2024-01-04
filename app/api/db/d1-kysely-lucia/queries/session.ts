import { User } from '#/types'
import { getKysely, getSqlite } from '../derive'
import { SelectSession } from '../schema'
import { querySqliteDatabase } from './util'

export async function getAllSessions(offset?: number, limit?: number): Promise<SelectSession[]> {
  let db = await getKysely()
  // adapter table name error
  let q = db.selectFrom('UserSession').selectAll()
  if (offset) {
    q = q.offset(offset)
  }
  if (limit) {
    q = q.limit(limit)
  }
  return await q.execute()
}

export async function getAllSessionsLocal(offset?: number, limit?: number): Promise<User[]> {
  return (await querySqliteDatabase('SELECT * FROM user_session', offset, limit)) as User[]
}
