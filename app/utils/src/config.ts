import dotenv from 'dotenv';
import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';
import path from 'node:path';
// import { __rootDir, __appDir, __wranglerDir } from '@cfw-boilerplate/types/src/root';
const __appDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const __wranglerDir = path.resolve(__appDir, 'api');
const conf = dotenv.config({ path: `${__appDir}/.env` });
const parsed = conf.parsed;
// console.log(parsed);
const vars = dotenv.config({ path: `${__wranglerDir}/.dev.vars` });
const parsedDev = vars.parsed;
if (!parsed || !parsedDev) {
  const which = [!parsed, !parsedDev];
  throw new Error(`[server] missing env vars -> \n\t\t[.env, .dev.vars] -> ${which}]`);
}

const env = createEnv({
  server: {
    VITE_LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']),
    NODE_ENV: z.enum(['development', 'production']),
  },
  runtimeEnv: process.env,
  isServer: typeof window === 'undefined',
});

const args = {
  // watch: process.argv.includes("--watch"),
  // liveReload: true,
};

export const config = {
  env,
  args,
};
