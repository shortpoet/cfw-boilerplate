import { Kysely, ParseJSONResultsPlugin } from 'kysely';
import { D1Dialect } from 'kysely-d1';
import { binding } from 'cf-bindings-proxy';
import { d1 } from '@lucia-auth/adapter-sqlite';
import { libsql } from '@lucia-auth/adapter-sqlite';
// import sqlite from 'better-sqlite3';
import { betterSqlite3 } from '@lucia-auth/adapter-sqlite';
import type { Database } from 'better-sqlite3';
import type { Client } from '@libsql/client';
import path from 'node:path';

import fs from 'fs';
import { D1Database } from '@cloudflare/workers-types';

export { getDatabaseFromEnv, deriveDatabaseAdapter };

const getDatabaseFromEnv = async (env: Env) => {
  if (env.NODE_ENV === 'development') {
    // unreliable i think. it is server when running `dev`
    // const thisDirectory = path.resolve('.');
    // console.log(`[db] getDatabaseFromEnv -> thisDirectory: ${thisDirectory}`);
    return (await import('better-sqlite3'))
      .default('local.sqlite')
      .exec(fs.readFileSync(`${env.__wranglerDir}/migrations/0000_init-db.sql`, 'utf8'));
  } else {
    const db = env.CFW_BOILERPLATE_DB;
    // console.log(`[db] getDatabaseFromEnv -> db: ${db}`);
    // const r = await db.batch([
    //   db.prepare('PRAGMA table_list'),
    //   db.prepare('PRAGMA table_info(user_session)'),
    // ]);
    // console.log(`[db] getDatabaseFromEnv -> res:`);
    // console.log(r[0].results);
    // console.log(r.result);
    return db;
  }
};

const getAdapter = (db: D1Database) =>
  d1(db, {
    user: 'user',
    key: 'user_key',
    session: 'user_session',
  });

const getSqlAdapter = (db: Client) =>
  libsql(db, {
    user: 'user',
    key: 'user_key',
    session: 'user_session',
  });

const getSql3Adapter = (db: Database) =>
  betterSqlite3(db, {
    user: 'user',
    key: 'user_key',
    session: 'user_session',
  });

const deriveDatabaseAdapter = async (env: Env) => {
  console.log(`[db] deriveDatabaseAdapter -> env: ${env.NODE_ENV}`);
  const db = await getDatabaseFromEnv(env);
  if (env.NODE_ENV === 'development') {
    return getSql3Adapter(db);
  } else {
    return getAdapter(db);
  }
};
