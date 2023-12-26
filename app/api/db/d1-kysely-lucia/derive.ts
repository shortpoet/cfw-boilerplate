import { d1 } from '@lucia-auth/adapter-sqlite'
import { libsql } from '@lucia-auth/adapter-sqlite'
// import sqlite from 'better-sqlite3';
import { betterSqlite3 } from '@lucia-auth/adapter-sqlite'
import type { Database as B3SQL } from 'better-sqlite3'
import type { Client } from '@libsql/client'
import fs from 'fs'
import { D1Database } from '@cloudflare/workers-types'
import { Kysely, ParseJSONResultsPlugin } from 'kysely'
import { D1Dialect } from 'kysely-d1'
import { CFWDatabase } from './schema'

export { deriveDatabaseAdapter, getKysely, getD1, getSqlite }

let d1Db: D1Database
let sqliteDb: B3SQL

const getD1 = async (env?: Env) => {
  if (d1Db) {
    return d1Db
  }
  if (!env) {
    throw new Error(
      `[db] [getDatabaseFromEnv] wrong usage -> env is undefined - instantiate db first`
    )
  }
  d1Db = env.CFW_BOILERPLATE_DB as D1Database
  // console.log(`[db] getD1 -> d1 with adapter functions: ${d1}`)
  // const r = await d1Db.batch([
  //   d1Db.prepare('PRAGMA table_list'),
  //   d1Db.prepare('PRAGMA table_info(user_session)')
  // ])
  // console.log(`[db] getDatabaseFromEnv -> res:`)
  // console.log(r[0].results)
  return d1Db
}

const getSqlite = async (env?: Env) => {
  if (sqliteDb) {
    return sqliteDb
  }
  if (!env) {
    throw new Error(
      `[db] [getDatabaseFromEnv] wrong usage -> env is undefined - instantiate db first`
    )
  }
  console.log(`[db] getDatabaseFromEnv -> env: ${env.NODE_ENV}`)
  sqliteDb = (await import('better-sqlite3'))
    .default('local.sqlite')
    .exec(fs.readFileSync(`${env.__wranglerDir}/migrations/0000_init-db.sql`, 'utf8')) as B3SQL
  return sqliteDb
}

const getKysely = async () => {
  const d1 = await getD1()
  return new Kysely<CFWDatabase>({
    dialect: new D1Dialect({ database: d1 }),
    // plugins: [new CamelCasePlugin()],
    plugins: [new ParseJSONResultsPlugin()]
    //log(event) {
    //  if (event.level === "query") {
    //    console.log(event.query.sql);
    //    console.log(event.query.parameters);
    //  }
    //},s
  })
}

const getAdapter = (db: D1Database) =>
  d1(db, {
    user: 'user',
    key: 'user_key',
    session: 'user_session'
  })

const getSqlAdapter = (db: Client) =>
  libsql(db, {
    user: 'user',
    key: 'user_key',
    session: 'user_session'
  })

const getSql3Adapter = (db: B3SQL) =>
  betterSqlite3(db, {
    user: 'user',
    key: 'user_key',
    session: 'user_session'
  })

const deriveDatabaseAdapter = async (env: Env) => {
  if (env.NODE_ENV === 'development') {
    const db = await getSqlite(env)
    return getSql3Adapter(db)
  } else {
    const db = await getD1(env)
    return getAdapter(db)
  }
}
