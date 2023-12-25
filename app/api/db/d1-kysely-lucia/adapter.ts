import { Kysely } from 'kysely'
import { Database } from './db'
import { q } from '.'

export function KyselyAdapter(db?: Kysely<Database>, options = {}, env?: Env) {
  return {
    async getAllUsers() {
      return q.getAllUsers()
    }
  }
}
