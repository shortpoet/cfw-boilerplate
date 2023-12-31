import colors from 'kleur';
import * as log from '../log';
import { setVars } from '../cf/vars';
import { getConfig } from '../config/config';
import { Options } from '../types';
import { __appDir, __rootDir, __wranglerDir } from '#/utils/root';
import { assert } from '../util';

export async function set(opts: Options) {
  log.info('[command] [vars] Retrieving Config');
  const { envVars, env, debug, envFile, wranglerFile, secrets } = await getConfig(opts);
  const conf = { env, envFile, debug, wranglerFile };
  const ssrDir = `${__appDir}/ui/src/pages`;
  assert(ssrDir, `[wrangle] [command] [vars] SSR directory does not exist: "${ssrDir}"`, true);
  log.info('[command] [vars] Setting Vars:');
  await setVars(conf, envVars, ssrDir, secrets);
}
