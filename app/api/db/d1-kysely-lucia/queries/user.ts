import { getKysely, getSqlite } from '../derive'
import { SelectUser } from '../schema'

export async function getAllUsers(offset?: number, limit?: number): Promise<SelectUser[]> {
  // let db
  // try {
  //   db = await getKysely()
  // } catch (error) {
  //   db = await getSqlite()
  //   // select all

  // }
  // if (!db) {
  //   throw new Error(`[db] [getAllUsers] -> db is undefined`)
  // }
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
