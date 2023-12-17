import { Kysely, ParseJSONResultsPlugin } from 'kysely';
import { D1Dialect } from 'kysely-d1';
import { binding } from 'cf-bindings-proxy';
import { d1 } from '@lucia-auth/adapter-sqlite';
import { libsql } from '@lucia-auth/adapter-sqlite';
import sqlite from 'better-sqlite3';
import { betterSqlite3 } from '@lucia-auth/adapter-sqlite';
import type { Database } from 'better-sqlite3';
import type { Client } from '@libsql/client';

import fs from 'fs';
import { D1Database } from '@cloudflare/workers-types';

export { getDatabaseFromEnv, deriveDatabaseAdapter };

const getDatabaseFromEnv = (env: Env) => {
  if (env.WORKER_ENVIRONMENT === 'dev') {
    return sqlite('local.sqlite').exec(fs.readFileSync('./sql/schema.sql', 'utf8'));
  } else {
    return env.CFW_BOILERPLATE_DB;
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

const deriveDatabaseAdapter = (env: Env) => {
  console.log(`[db] deriveDatabaseAdapter -> env: ${env.NODE_ENV}`);
  const db = getDatabaseFromEnv(env);
  if (env.WORKER_ENVIRONMENT === 'dev') {
    return getSql3Adapter(db);
  } else {
    return getAdapter(db);
  }
};
