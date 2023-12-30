import { User } from '#/types'
import { getKysely, getSqlite } from '../derive'
import { SelectSession, SelectUser } from '../schema'

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

async function queryDatabase(query: string, offset?: number, limit?: number) {
  return new Promise(async (resolve, reject) => {
    try {
      let db = await getSqlite()

      let params = []
      if (offset) {
        query += ' OFFSET ?'
        params.push(offset)
      }

      if (limit) {
        query += ' LIMIT ?'
        params.push(limit)
      }

      const stmt = db.prepare(query)
      const result = stmt.all(...params)

      resolve(result)
    } catch (error) {
      reject(error)
    }
  })
}

export async function getAllUsersLocal(offset?: number, limit?: number): Promise<User[]> {
  // not case sensitive...
  return (await queryDatabase('SELECT * FROM User', offset, limit)) as User[]
}

export async function getAllSessionsLocal(offset?: number, limit?: number): Promise<User[]> {
  return (await queryDatabase('SELECT * FROM user_session', offset, limit)) as User[]
}
