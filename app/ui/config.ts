import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'
import path from 'node:path'
import dotenv from 'dotenv'
import colors from 'kleur'

export const getConfig = (mode: string) => {
  console.log(colors.green(`[ui] [config] mode: `), colors.magenta(`${mode}`))
  const __appDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
  const envDir = __appDir
  console.log(colors.green(`[ui] [config] envDir: `), colors.magenta(`${envDir}`))
  console.log(
    colors.green(`[ui] [config] vars location: `),
    colors.magenta(`${__appDir}/api/wrangler/.dev.vars`)
  )
  const envPath = mode === 'development' ? `${envDir}/.env` : `${envDir}/.env.${mode}`
  console.log(colors.green(`[ui] [config] envPath: `), colors.magenta(`${envPath}`))
  const parsed = dotenv.config({ path: envPath }).parsed

  const parsedSecret = dotenv.config({ path: `${envDir}/.env.secret` }).parsed
  const parsedDev = dotenv.config({ path: `${__appDir}/api/wrangler/.dev.vars` }).parsed
  // console.log(parsed);
  if (!parsed || !parsedDev) {
    const which = [!parsed, !parsedDev]
    throw new Error(`[server] missing env vars -> \n\t\t[.env, .dev.vars] -> ${which}]`)
  }

  const env = createEnv({
    server: {
      VITE_LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']),
      NODE_ENV: z.enum(['development', 'staging', 'production'])
    },
    runtimeEnv: process.env,
    isServer: typeof window === 'undefined'
  })
  // console.log(colors.green(`[ui] [config] env: `), colors.magenta(`${JSON.stringify(env)}`));

  return { envDir, parsed, parsedDev, parsedSecret, env }
}
