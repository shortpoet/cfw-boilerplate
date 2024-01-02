export { isWorker, getManifest, parseEnv }

import { escapeNestedKeys, logLevel, logger, msToTime } from '#/utils'
import { KVNamespace } from '@cloudflare/workers-types'

const FILE_LOG_LEVEL = 'debug'

// https://github.com/cloudflare/wrangler2/issues/1481
// https://community.cloudflare.com/t/how-to-detect-the-cloudflare-worker-runtime/293715
function isWorker() {
  return (
    // @ts-ignore
    typeof WebSocketPair !== 'undefined' || typeof caches !== 'undefined'
  )
}

async function getManifest(env: Env) {
  return isWorker()
    ? // @ts-expect-error
      (await import('__STATIC_CONTENT_MANIFEST')) || ''
    : 'local'
}

const parseEnv = async (kv: KVNamespace) => {
  const envVars = await kv.list()
  const out: any = {}
  try {
    for (let [k, v] of Object.entries(envVars.keys)) {
      let logObj = escapeNestedKeys(JSON.parse((await kv.get(v.name)) || ''), [
        'token',
        'accessToken'
      ])

      out[v.name] = logObj
    }
  } catch (error) {
    console.error(`[api] [controllers] [health] [parseEnv] error: ${error}`)
  }
  return out
}
