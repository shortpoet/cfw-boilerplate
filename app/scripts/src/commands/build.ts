import colors from 'kleur'

import { Options } from '../types'
import * as log from '../log'
import { getConfig, secretsFilePath } from '../config/config'
import { setSecrets } from '../secret/secret'
import { assert } from '../util'
import { build } from '../bild/build-worker'
import { __appDir } from '#/utils/root'

export default async function (opts: Options) {
  log.info('Retrieving Config')
  const conf = await getConfig(opts)
  const { env, debug, wranglerFile, secrets, goLive } = conf
  log.info('[command] [build] Building:')
  // TODO add to build
  await setSecrets(secrets, secretsFilePath, { env, debug, wranglerFile, goLive })
  assert(
    secretsFilePath,
    `[wrangle] [config] Secret file does not exist: "${secretsFilePath}"`,
    true
  )
  const entry = `${__appDir}/api/src/index.ts`
  const out = `${__appDir}/api/build/worker.mjs`
  build({ entry, out, debug })
}
