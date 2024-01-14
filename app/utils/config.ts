import dotenv from 'dotenv'
import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'
import path from 'node:path'
import colors from 'kleur'
import fs from 'node:fs'

const __appDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const envDir = __appDir
// merge top to bottom secrets in parsedDev have precedence
const parsedDev = dotenv.config({ path: `${__appDir}/api/wrangler/.dev.vars` }).parsed
const parsed = dotenv.config({ path: `${envDir}/.env` }).parsed
// const parsedSecret = dotenv.config({ path: `${envDir}/.env.secret` }).parsed
console.log(colors.green(`[utils] `), colors.magenta(`[config] envDir: ${envDir}`))
// console.log(parsed);
if (!parsed || !parsedDev) {
  const which = [!parsed, !parsedDev]
  throw new Error(`[server] missing env vars -> \n\t\t[.env, .dev.vars] -> ${which}]`)
}
const SSL_KEY = fs.readFileSync(`${__appDir}/certs/key.pem`)
const SSL_CERT = fs.readFileSync(`${__appDir}/certs/cert.pem`)

const env: EnvVars = createEnv({
  server: {
    HOST: z.string(),
    API_HOST: z.string(),
    VITE_PORT: z.string(),
    VITE_PORT_API: z.string(),
    VITE_LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']),
    NODE_ENV: z.enum(['development', 'staging', 'production']),
    WORKER_ENVIRONMENT: z.enum(['dev', 'rng', 'qa', 'prod']),
    PRIVATE_KEY: z.string(),
    PUBLIC_KEY: z.string(),
    VITE_APP_NAME: z.string(),
    __SECRET__: z.string(),
    AUTH_SECRET: z.string(),
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    JMAP_TOKEN: z.string(),
    EMAIL_FROM: z.string(),
    EMAIL_SERVER_HOST: z.string(),
    EMAIL_SERVER_PORT: z.string(),
    EMAIL_SERVER_USER: z.string()
  },
  runtimeEnv: process.env,
  isServer: typeof window === 'undefined'
})

const args = {
  // watch: process.argv.includes("--watch"),
  // liveReload: true,
}

console.log(colors.green(`[utils] `), colors.magenta(`[config] config:`))

const config = {
  env: { ...env, __appDir, __wranglerDir: `${__appDir}/api/wrangler`, SSL_KEY, SSL_CERT },
  args
}

console.log(config)

export { config }
