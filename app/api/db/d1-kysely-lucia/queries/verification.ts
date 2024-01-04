import { User } from '#/types'
import { getKysely } from '../derive'
import { querySqliteDatabaseParams } from './util'

export async function deleteVerificationCode(userId: User['userId']) {
  let db = await getKysely()
  await db.deleteFrom('VerificationCode').where('user_id', '=', userId).execute()
}

export async function deleteVerificationCodeLocal(userId: User['userId']) {
  return await querySqliteDatabaseParams('DELETE FROM verification_code WHERE user_id = ?', [
    userId
  ])
}

export async function createVerificationCode(
  userId: User['userId'],
  code: string,
  expires: number
) {
  let db = await getKysely()
  await db.insertInto('VerificationCode').values({ user_id: userId, code, expires }).execute()
}

export async function createVerificationCodeLocal(
  userId: User['userId'],
  code: string,
  expires: number
) {
  return await querySqliteDatabaseParams(
    'INSERT INTO verification_code (user_id, code, expires) VALUES (?, ?, ?)',
    [userId, code, expires]
  )
}
