import { User } from '#/types'
import { getKysely } from '../derive'
import { querySqliteDatabaseParams, runSqliteDatabaseParams } from './util'

export async function deleteVerificationCode(userId: User['userId']) {
  let db = await getKysely()
  await db.deleteFrom('VerificationCode').where('user_id', '=', userId).execute()
}

export async function deleteVerificationCodeLocal(userId: User['userId']) {
  return await runSqliteDatabaseParams('DELETE FROM verification_code WHERE user_id = ?', [userId])
}

export async function createVerificationCode(
  code: string,
  userId: User['userId'],
  expires: number
) {
  let db = await getKysely()
  await db.insertInto('VerificationCode').values({ code, user_id: userId, expires }).execute()
}

export async function createVerificationCodeLocal(
  code: string,
  userId: User['userId'],
  expires: number
) {
  return await runSqliteDatabaseParams(
    'INSERT INTO verification_code (code, user_id, expires) VALUES (?, ?, ?)',
    [code, userId, expires]
  )
}

export async function getVerificationCode(code: string) {
  let db = await getKysely()
  const result = await db.selectFrom('VerificationCode').where('code', '=', code).execute()
  return result[0]
}

export async function getVerificationCodeLocal(code: string) {
  return await querySqliteDatabaseParams('SELECT * FROM verification_code WHERE code = ?', [code])
}
