import { resolve } from 'node:path'
import * as dotenv from 'dotenv'
import colors from 'kleur'

import * as log from '../log'
import { Config, Options, WranglerToml, WrangleConfig } from '../types'
import { __appDir, __rootDir, __wranglerDir } from '#/utils/root'
import { assert, formatBindingId, getToml, writeToml } from '../util'
import { assertTomlEnv } from './toml'
// import { setBindings } from '../cf/name';

const __dataDir = `${__appDir}/data`
export const gitDataPath = `${__dataDir}/git.json`
export const ssrDir = `${__appDir}/ui/src/pages`
export const secretsFilePath = `${__wranglerDir}/.dev.vars`

export async function getConfig(opts: Options): Promise<Config> {
  if (opts.debug) {
    log.print('cyan', `[wrangle] [config] Options: ${JSON.stringify(opts, null, 2)}`)
  }
  opts.cwd = resolve(opts.cwd as Options['cwd'])

  const dir = opts.dir || resolve(__wranglerDir)
  assert(dir, `[wrangle] [config] Workers directory does not exist: "${dir}"`, true)

  const cwd = opts.cwd || process.cwd()
  const goLive = opts.goLive || false
  const env = opts.env || 'dev'
  const debug = opts.debug || false
  const only = opts.only
  const ignore = opts.ignore
  const file = opts.file
  const fileOnly = opts.fileOnly

  const wranglerFile = `${dir}/wrangler.${env}.toml.json`
  const envFile = `${__appDir}/.env.${env}`

  assert(envFile, `[wrangle] [config] Env file does not exist: "${envFile}"`, true)
  assert(wranglerFile, `[wrangle] [config] Wrangler file does not exist: "${wranglerFile}"`, true)

  const envVars = dotenv.config({
    path: envFile
  }).parsed
  if (!envVars) {
    throw new Error(`[wrangle] [command] [vars] No config found in ${envFile}`)
  }

  const appName = process.env.VITE_APP_NAME
  assert(appName, `[wrangle] [config] No app name found`, false)
  log.print('cyan', `[wrangle] [config] App name: ${colors.cyan(appName)}`)
  const secrets = {
    __SECRET__: `Apps/${appName}/${env}/__SECRET__`,
    AUTH_SECRET: `Apps/${appName}/${env}/AUTH_SECRET`,
    GITHUB_CLIENT_ID: `Github/oauth/${appName}/${env}/GITHUB_CLIENT_ID`,
    GITHUB_CLIENT_SECRET: `Github/oauth/${appName}/${env}/GITHUB_CLIENT_SECRET`,
    EMAIL_SERVER_PASSWORD: `Mail/fastmail/ai-maps-nodemailer`,
    JMAP_TOKEN: `Mail/fastmail/ai-maps-email-send-token`
  }

  await assertTomlEnv({ env, wranglerFile, appName, debug, envVars, goLive })

  const bindingNameBase = `${appName.toUpperCase().replace(/-/g, '_')}`
  const bindingNameSuffixes = [
    'UI'
    // "SESSIONS", "USERS", "MAPS"
  ]
  const bindingNameDb = `${bindingNameBase}_DB`
  const bindingNameUI = `${bindingNameBase}_UI`
  const bindingIdDb = formatBindingId(
    { appName, env, bindingNameUI, bindingNameDb },
    { isUI: false }.isUI
  )
  const bindingIdUi = formatBindingId(
    { appName, env, bindingNameUI, bindingNameDb },
    { isUI: true }.isUI
  )
  const databaseName = bindingIdDb

  assert(bindingNameDb, `[wrangle] [config] No binding name found`, false)
  assert(bindingIdDb, `[wrangle] [config] No binding id found`, false)
  assert(databaseName, `[wrangle] [config] No database name found`, false)

  return {
    cwd,
    goLive,
    dir,
    env,
    debug,
    only,
    ignore,
    envFile,
    wranglerFile,
    secrets,
    envVars,
    appName,
    bindingNameUI,
    bindingNameDb,
    databaseName,
    bindingIdUi
  }
}
