import colors from 'kleur'
import * as log from '../log'
import { Options } from '../types'
import { __appDir, __rootDir, __wranglerDir } from '#/utils/root'
import { generateRouteMappingFile } from '../bild/generate-paths'
import { ssrDir } from '../config/config'

export async function generateRoutes(opts: Options) {
  log.info('[command] [git set] Retrieving Config')
  // const conf = await getConfig(opts);
  log.info('[command] [generate] Setting Paths:')
  await generateRouteMappingFile(ssrDir)
}
