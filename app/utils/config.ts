import dotenv from 'dotenv';
import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';
import path from 'node:path';
import colors from 'kleur';

const __appDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const envDir = __appDir;
const parsed = dotenv.config({ path: `${envDir}/.env` }).parsed;
const parsedSecret = dotenv.config({ path: `${envDir}/.env.secret` }).parsed;
const parsedDev = dotenv.config({ path: `${__appDir}/api/.dev.vars` }).parsed;
console.log(colors.green(`[utils] `), colors.magenta(`[config] envDir: ${envDir}`));
// console.log(parsed);
if (!parsed || !parsedDev) {
  const which = [!parsed, !parsedDev];
  throw new Error(`[server] missing env vars -> \n\t\t[.env, .dev.vars] -> ${which}]`);
}

const env: EnvVars = createEnv({
  server: {
    HOST: z.string(),
    VITE_PORT: z.string(),
    VITE_LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']),
    NODE_ENV: z.enum(['development', 'production']),
    NEXTAUTH_SECRET: z.string(),
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
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
