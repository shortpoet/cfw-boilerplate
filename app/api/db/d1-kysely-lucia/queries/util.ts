import { getSqlite } from '../derive'

export async function querySqliteDatabase(query: string, offset?: number, limit?: number) {
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

export async function querySqliteDatabaseParams(query: string, params: any[]) {
  return new Promise(async (resolve, reject) => {
    try {
      let db = await getSqlite()

      const stmt = db.prepare(query)
      const result = stmt.all(...params)

      resolve(result)
    } catch (error) {
      reject(error)
    }
  })
}

export async function runSqliteDatabaseParams(query: string, params: any[]) {
  return new Promise(async (resolve, reject) => {
    try {
      let db = await getSqlite()

      const stmt = db.prepare(query)
      const result = stmt.run(...params)

      resolve(result)
    } catch (error) {
      reject(error)
    }
  })
}
