import { getKysely } from '../derive'
import { SelectUser } from '../schema'

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
