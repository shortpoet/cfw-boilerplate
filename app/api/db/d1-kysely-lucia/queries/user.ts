import { getKysely } from '../derive'

export async function getAllUsers(offset?: number, limit?: number) {
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
