import sade from 'sade'
import * as kv from './commands/kv'
import * as vars from './commands/vars'
import * as git from './commands/git'
import * as db from './commands/db'
import * as secret from './commands/secret'
import build from './commands/build'
import go from './commands/go'

const cli = sade('wrangle')
  .version('0.0.2')
  // .version('$$VERSION$$') // Note: Inject via build step
  .option('-C, --cwd', 'The relative working directory', '.')
  .option('-g, --goLive', 'Go live', false)
  .option('-e, --env', 'The environment to list', 'dev')
  .option('-d, --debug', 'Debug mode', false)
  // .option('-q, --quiet', 'Quiet mode', false)
  // .option('-o, --output', 'The output directory', 'dist')
  // .option('-i, --ignore', 'The list of Worker names to skip')
  // .option('-s, --single', 'The target is a single Worker')
  // .option('-p, --profile', 'The profile to use')
  // .option('-m, --migration', 'The migration to apply')
  // .option('-b, --bindingName', 'The binding name')
  .option('-f, --file', 'The secret file || sql file')
  .option('-o, --fileOnly', 'Only write to secret file', false)
  .option('-s, --sql', 'The sql to execute')
  .option('-t, --targetEnv', 'The environment to set')

  .command('kv list')
  .alias('kv ls')
  .describe('List all KV namespaces')
  .action(kv.list)

  .command('kv create')
  .describe('Create KV namespaces')
  .action(kv.create)

  .command('kv delete')
  .describe('Delete KV namespaces')
  // .option('-C, --cwd', 'The relative working directory', '.')
  // .option('-e, --env', 'The environment to list', 'dev')
  // .option('-d, --debug', 'Debug mode', false)
  .option('-b, --bindingName', 'The binding name')
  .action(kv.deleteKV)

  .command('vars set')
  .describe('Set KV vars')
  .action(vars.set)

  .command('secret set')
  .describe(
    `Set KV secrets - can use with any secret file
    \t\t  optional target env - from env is always -e`
  )
  .option('-f, --file', 'The secret file')
  .option('-o, --fileOnly', 'Only write to secret file', false)
  .option('-t, --targetEnv', 'The environment to set')
  .action(secret.set)

  .command('git set')
  .describe('Set git config')
  .action(git.set)

  .command('db list')
  .alias('db ls')
  .describe('List all D1 databases')
  .action(db.list)

  .command('db create')
  .describe('Create D1 databases')
  .action(db.create)

  .command('db apply')
  .describe('Apply D1 database migrations')
  .action(db.apply)

  .command('db delete')
  .describe('Delete D1 databases')
  .action(db.deleteDb)

  .command('db exec')
  .describe('Execute D1 sql')
  .action(db.exec)
  .option('-f, --file', 'The file to execute')
  .option('-s, --sql', 'The sql to execute')

  .command('build')
  .describe('Compile the Worker(s) within a directory.')
  .option('-C, --cwd', 'The relative working directory', '.')
  .option('-e, --env', 'The environment to list', 'dev')
  // .option('-d, --dir', 'The directory containing Worker scripts', 'api')
  // .option('-o, --only', 'The list of Worker names to build; overrides `--ignore` list!')
  // .option('-i, --ignore', 'The list of Worker names to skip')
  // .option('-s, --single', 'The target is a single Worker')
  .action(build)

  .command('go')
  .describe('Go live')
  .option('-C, --cwd', 'The relative working directory', '.')
  .option('-e, --env', 'The environment to list', 'dev')
  .action(go)

cli.parse(process.argv, {
  boolean: [
    'debug',
    'fileOnly',
    // 'single',
    //  'quiet',
    'goLive'
  ],
  string: [
    'env',
    'targetEnv',
    // 'dir',
    // 'output',
    // 'only',
    // 'ignore',
    // 'profile',
    // 'migration',
    // 'bindingName',
    'file',
    'sql'
  ]
})
