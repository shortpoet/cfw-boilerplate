import colors from 'kleur'
import * as log from '../log'
import { getConfig, secretsFilePath as _secretsFilePath } from '../config/config'
import { Options } from '../types'
import { __appDir, __rootDir, __wranglerDir } from '#/utils/root'
import { assert, promptForInput } from '../util'
import { setSecrets } from '../secret/secret'
import path from 'node:path'

export async function set(opts: Options) {
  log.info('[command] [secret] Retrieving Config')
  const { envVars, env, debug, envFile, wranglerFile, secrets, goLive } = await getConfig(opts)
  const conf = { env, envFile, debug, wranglerFile, goLive }
  console.log(opts)
  const { file: _secretFile, targetEnv, fileOnly } = opts
  console.log(colors.yellow(`[wrangle] [secret] [set] Setting secret for ${env}`))
  console.log(colors.yellow(`[wrangle] [secret] [set] fileOnly: ${fileOnly}`))
  let secretFile
  if (_secretFile) {
    secretFile = path.resolve(_secretFile)
    const resp = await promptForInput(
      colors.yellow(
        `[wrangle] [secret] [set] Setting secret from/to secret file: ${secretFile}. Press enter to continue.`
      )
    )
    if (resp !== '') {
      log.info('[command] [secret] Exiting.')
      process.exit(0)
    }
  }
  log.info('[command] [secret] Setting secret:')
  const secretsFilePath = secretFile ?? _secretsFilePath
  await setSecrets(
    secrets,
    secretsFilePath,
    { env, debug, wranglerFile, goLive },
    targetEnv,
    fileOnly
  )
}
