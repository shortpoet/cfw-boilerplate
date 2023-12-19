import colors from 'kleur';
import * as log from '../log';
import { getConfig } from '../config/config';
import { Options } from '../types';
import { __appDir, __rootDir, __wranglerDir } from '#/utils/root';
import { applyMigration, createMigration } from '../db/migration';
import { executeD1Sql } from '../db/sql';
import { assertDatabase, deleteDatabase, getDatabase, getDatabases } from '../db/db';
import { writeDatabaseToToml } from '../db/toml';

export async function list(opts: Options) {
  const { env, debug, envFile, wranglerFile, goLive } = await getConfig(opts);
  const conf = { env, envFile, debug, wranglerFile, goLive };
  log.info('[command] [db] Retrieving Databases:');
  const items = await getDatabases({ ...conf, goLive: true });
  log.printList(items, ['uuid', 'name', 'version', 'created_at']);
}

export async function apply(opts: Options) {
  const { env, debug, envFile, wranglerFile, appName, databaseName, bindingNameDb, goLive } =
    await getConfig(opts);
  const conf = { env, envFile, debug, wranglerFile, appName, databaseName, bindingNameDb, goLive };
  const _conf = await getConfig(opts);
  // console.log(_conf);
  // assertDatabase(conf);
  log.info('[command] [db] Applying Migration:');
  // migration smoothly sasserted by sade
  // return;
  applyMigration(databaseName, conf);
}

export async function deleteDb(opts: Options) {
  const _conf = await getConfig(opts);
  const { env, debug, envFile, wranglerFile, appName, databaseName, bindingNameDb, goLive } =
    await getConfig(opts);
  const conf = { env, envFile, debug, wranglerFile, appName, databaseName, bindingNameDb, goLive };
  // assertDatabase(conf);
  log.info('[command] [db] Deleting Database:');
  // migration smoothly sasserted by sade
  deleteDatabase(conf);
  writeDatabaseToToml('', conf, true);
}

export async function create(opts: Options) {
  const _conf = await getConfig(opts);
  const { env, debug, envFile, wranglerFile, appName, databaseName, bindingNameDb, goLive } =
    await getConfig(opts);
  const conf = { env, envFile, debug, wranglerFile, appName, databaseName, bindingNameDb, goLive };
  log.info('[command] [db] Creating - Asserting Database:');
  assertDatabase(conf);
}

export async function exec(opts: Options) {
  const { env, debug, wranglerFile, databaseName, goLive } = await getConfig(opts);
  const conf = { env, debug, wranglerFile, databaseName, goLive };
  const { file: sqlFile, sql } = opts;
  const input = sqlFile || sql;
  if (!input) throw new Error('[command] [db] No sql or sqlFile');
  log.info(`[command] [db] Executing SQL: ${input}`);
  executeD1Sql(conf, sqlFile, sql);
}

export async function assert(opts: Options) {
  const { env, debug, envFile, wranglerFile } = await getConfig(opts);
  const conf = { env, envFile, debug, wranglerFile };
  log.info('[command] [db] :');
}

export async function _db(opts: Options) {
  const { env, debug, envFile, wranglerFile } = await getConfig(opts);
  const conf = { env, envFile, debug, wranglerFile };
  log.info('[command] [db] :');
}

// const dbCommand = opts.dbCommand;
// const subCommand = opts.subCommand;
// const bindingIdDb = formatBindingId(opts, { isUi: false }.isUi);
// const databaseName = bindingIdDb;
// const migrationName = subCommand;

// let databaseId;
// const database = getDatabase(databaseName, env);
// console.log(database);
// databaseId = database.uuid;
// console.log(databaseId);

// const isDelete = dbCommand === 'delete' && !!databaseId;

// switch (true) {
//   case dbCommand === 'create':
//     if (!subCommand) {
//       throw new Error('no migration name');
//     }
//     createMigration(databaseName, migrationName, conf);
//     break;
//   case dbCommand === 'apply':
//     applyMigration(databaseName, conf);
//     break;
//   case dbCommand === 'sql':
//     executeD1Sql(databaseName, conf, undefined, subCommand);
//     break;
//   case dbCommand === 'file':
//     dbCommand = dbCommand?.split(':')[1];
//     executeD1Sql(databaseName, conf, subCommand, undefined);
//     break;
//   case isDelete:
//     deleteDatabase(databaseName, conf);
//     break;
//   case dbCommand !== undefined && isDelete:
//     throw new Error('invalid migration command');
//   default:
//     return;
//     break;
// }
