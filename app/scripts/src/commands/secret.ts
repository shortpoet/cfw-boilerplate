import colors from 'kleur';
import * as log from '../log';
import { setVars } from '../cf/vars';
import { getConfig, secretsFilePath as _secretsFilePath } from '../config/config';
import { Options } from '../types';
import { __appDir, __rootDir, __wranglerDir } from '#/utils/root';
import { assert, promptForInput } from '../util';
import { setSecrets } from '../secret/secret';
import path from 'node:path';

export async function set(opts: Options) {
  log.info('[command] [vars] Retrieving Config');
  const { envVars, env, debug, envFile, wranglerFile, secrets, goLive } = await getConfig(opts);
  const conf = { env, envFile, debug, wranglerFile, goLive };
  const { file: _secretFile, targetEnv } = opts;
  let secretFile;
  if (_secretFile) {
    secretFile = path.resolve(_secretFile);
    const resp = await promptForInput(
      colors.yellow(
        `[wrangle] [vars] [set] Setting vars from/to secret file: ${secretFile}. Press enter to continue.`
      )
    );
    if (resp !== '') {
      log.info('[command] [vars] Exiting.');
      process.exit(0);
    }
  }
  log.info('[command] [vars] Setting Vars:');
  const secretsFilePath = secretFile ?? _secretsFilePath;
  await setSecrets(secrets, secretsFilePath, { env, debug, wranglerFile, goLive }, targetEnv);
}
