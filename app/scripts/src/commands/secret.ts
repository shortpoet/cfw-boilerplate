import colors from 'kleur';
import * as log from '../log';
import { setVars } from '../cf/vars';
import { getConfig, secretsFilePath as _secretsFilePath } from '../config/config';
import { Options } from '../types';
import { __appDir, __rootDir, __wranglerDir } from '#/utils/root';
import { assert } from '../util';
import { setSecrets } from '../secret/secret';

export async function set(opts: Options) {
  log.info('[command] [vars] Retrieving Config');
  const { envVars, env, debug, envFile, wranglerFile, secrets, goLive } = await getConfig(opts);
  const conf = { env, envFile, debug, wranglerFile, goLive };
  const { file: secretFile, targetEnv } = opts;
  log.info('[command] [vars] Setting Vars:');
  const secretsFilePath = secretFile ?? _secretsFilePath;
  await setSecrets(secrets, secretsFilePath, { env, debug, wranglerFile, goLive }, targetEnv);
  assert(
    secretsFilePath,
    `[wrangle] [config] Secret file does not exist: "${secretsFilePath}"`,
    true
  );
}
