import colors from 'kleur';
import * as log from '../log';
import { setVars } from '../cf/vars';
import { getConfig, gitDataPath } from '../config/config';
import { Options } from '../types';
import { __appDir, __rootDir, __wranglerDir } from '#/utils/root';
import { assert } from '../util';
import { setGitconfig } from '../git/git';

export async function set(opts: Options) {
  log.info('[command] [git set] Retrieving Config');
  const conf = await getConfig(opts);
  assert(
    gitDataPath,
    `[wrangle] [command] [git set] gitDataPath directory does not exist: "${gitDataPath}"`,
    true
  );
  log.info('[command] [vars] Setting Vars:');
  await setGitconfig(gitDataPath, conf);
}
