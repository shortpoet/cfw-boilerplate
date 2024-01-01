import http from 'http'
import { error, json } from 'itty-router'
import fs from 'node:fs'
import { corsify, Api, router } from '@cfw-boilerplate/api/src/router'
import { mapHttpHeaders, serverLogStart, ctx, serverLogEnd } from './util'
import { __rootDir, __appDir, __wranglerDir } from '#/utils/root'
import fetch from 'node-fetch'

import { config } from '#/utils/config'
import { getCorrelationId, getLogger } from '#/utils/logger/logger'
import { clearCookie, withCookie } from '#/api/src/middleware/cookie'
const isSsr = config.env.SSR
const nodeEnv = config.env.NODE_ENV
const envLogLevel = config.env.VITE_LOG_LEVEL

const logger = getLogger({ isSsr, nodeEnv, envLogLevel })

const HOST: string = config.env.HOST || '127.0.0.1'
const PORT: number = parseInt(config.env.PORT || '3333')
const SECRET: string = config.env.AUTH_SECRET || ''
const GITHUB_CLIENT_ID: string = config.env.GITHUB_CLIENT_ID || ''
const GITHUB_CLIENT_SECRET: string = config.env.GITHUB_CLIENT_SECRET || ''
const PRIVATE_KEY: string = config.env.PRIVATE_KEY || ''
const PUBLIC_KEY: string = config.env.PUBLIC_KEY || ''
if (!SECRET || !GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET || !PRIVATE_KEY || !PUBLIC_KEY) {
  const which = [!SECRET, !GITHUB_CLIENT_ID, !GITHUB_CLIENT_SECRET || !PRIVATE_KEY || !PUBLIC_KEY]
    .map((b) => b.toString())
    .filter(Boolean)
    .join(', ')
  throw new Error(
    `[server] auth.config -> missing secret or env vars -> \n\t\t[AUTH_SECRET, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET] -> ${which}]`
  )
}

const server = http.createServer(async (req, res) => {
  res.on('error', (err) => {
    console.error(err)
    res.statusCode = 500
    res.end(err)
  })

  const { mappedHeaders, contentType } = mapHttpHeaders(req.headers)
  if (req.url) {
    logger.child({
      correlationId: getCorrelationId(new Headers(mappedHeaders))
    })
    logger.info(`[server] req.url: ${req.url}`)
    serverLogStart(req, contentType ?? '')
    console.log(`[server] [simple] -> apiReq -> ${config.env.__appDir}`)
    console.log(`[server] [simple] -> apiReq -> ${config.env.__wranglerDir}`)
    console.log(`[server] [simple] -> mappedHeaders -> ${JSON.stringify(mappedHeaders, null, 2)}`)

    const dataStr = await new Promise((resolve, reject) => {
      let requestData = ''
      req.on('data', (chunk) => {
        console.log(`[server] [simple] -> req.on('data') -> chunk.toString()`)
        console.log(chunk.toString())
        requestData += chunk.toString()
      })

      req.on('end', () => {
        resolve(requestData)
      })

      req.on('error', (error) => {
        reject(error)
      })
    })

    let data
    if (dataStr && typeof dataStr === 'string') {
      try {
        data = JSON.parse(dataStr)
        // data = { data: JSON.parse(dataStr) }
      } catch (error) {
        console.error(error)
        data = dataStr
        // data = { data: dataStr }
      }
    }
    console.log(`[server] [simple] -> data ->`)
    console.log(data)

    const _req = new Request(new URL(req.url, 'http://' + req.headers.host), {
      method: req.method,
      headers: mappedHeaders,
      body: JSON.stringify(data) ?? undefined
    }) as unknown as Request
    const _res = new Response() as unknown as Response
    const env = config.env

    const resp = await Api.handle({
      req: _req,
      res: _res,
      env,
      ctx,
      data
    })
    // .then(json)
    // .catch(error)
    // .then(corsify)

    if (!resp) {
      res.statusCode = 404
      res.end('Not Found')
      return
    }

    const incomingHeaders = Array.from(resp.headers.entries()) as any
    logger.debug(`server] incomingHeaders -> ${JSON.stringify(incomingHeaders, null, 2)}`)

    res.writeHead(resp.status, resp.statusText, incomingHeaders)

    res.end((await resp.text()) + '\n')

    res.on('finish', () => {
      serverLogEnd(req, res)
    })
  }
})

server.on('error', (e: NodeJS.ErrnoException) => {
  if (e.code === 'EADDRINUSE') {
    logger.warn('Address in use, retrying...')
    setTimeout(() => {
      server.close()
      server.listen(PORT, HOST)
    }, 1000)
  }
  console.error(e)
})

server.listen(PORT, HOST, () => {
  logger.info(`Server running at http://${HOST}:${PORT}/`)
  logger.info(`[server] [simple] [nodeEnv] -> ${nodeEnv}`)
  logger.info(`[server] [simple] [isSsr] -> ${isSsr}`)
  logger.info(`[server] [simple] [envLogLevel] -> ${envLogLevel}`)
  const openapi_schema = router.schema
  const schemaPath = `${__appDir}/api/openapi.json`
  fs.writeFileSync(schemaPath, JSON.stringify(openapi_schema, null, 2))
  logger.info(`[server] [simple] [openapi_schema] -> written to ${schemaPath}`)
})
