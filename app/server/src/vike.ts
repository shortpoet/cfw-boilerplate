// This file isn't processed by Vite, see https://github.com/vikejs/vike/issues/562
// Consequently:
//  - When changing this file, you needed to manually restart your server for your changes to take effect.
//  - To use your environment variables defined in your .env files, you need to install dotenv, see https://vike.dev/env
//  - To use your path aliases defined in your vite.config.js, you need to tell Node.js about them, see https://vike.dev/path-aliases

// If you want Vite to process your server code then use one of these:
//  - vavite (https://github.com/cyco130/vavite)
//     - See vavite + Vike examples at https://github.com/cyco130/vavite/tree/main/examples
//  - vite-node (https://github.com/antfu/vite-node)
//  - HatTip (https://github.com/hattipjs/hattip)
//    - You can use Bati (https://batijs.github.io/) to scaffold a Vike + HatTip app. Note that Bati generates apps that use the V1 design (https://vike.dev/migration/v1-design) and Vike packages (https://vike.dev/vike-packages)

import express from 'express'
import compression from 'compression'
import { renderPage } from 'vike/server'
import { root } from './root.js'
import colors from 'kleur'
import { createServerAdapter } from '@whatwg-node/server'
import fs from 'node:fs'

import { __rootDir, __appDir, __wranglerDir } from '#/utils/root'
import { Api, router } from '@cfw-boilerplate/api/src/router'
import { ctx, mapHttpHeaders, serverLogStart } from './util'
import { config } from '#/utils/config'
import { getCorrelationId, getLogger } from '#/utils/logger/logger.js'
import { getAuthCookies, logWorkerEnd, logWorkerStart } from '#/utils/index.js'
import { getSession } from '#/api/src/router/routes/auth/handlers/session-handler.js'

const isSsr = config.env.SSR
const nodeEnv = config.env.NODE_ENV
const envLogLevel = config.env.VITE_LOG_LEVEL

const logger = getLogger({ isSsr, nodeEnv, envLogLevel })

const HOST: string = config.env.HOST || '127.0.0.1'
const PORT: number = parseInt(config.env.VITE_PORT || '3000')
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

const env = config.env

const apiAdapter = createServerAdapter(async (req: Request) => {
  logger.child({
    correlationId: getCorrelationId(req.headers)
  })
  logWorkerStart(req, env)
  logger.info(`[server] req.url: ${req.url}`)
  const headers = req.headers
  // const { mappedHeaders, contentType } = mapHttpHeaders(req.headers)
  const host = headers.get('host')
  let data
  if (req.body) {
    try {
      data = await req.json()
    } catch (error) {
      console.log(error)
      data = await req.text()
    }
  }
  const _req = new Request(new URL(req.url, 'http://' + host), {
    method: req.method,
    headers: req.headers,
    body: JSON.stringify(data) ?? undefined
  }) as unknown as Request
  const _res = new Response() as unknown as Response

  return Api.handle({
    req: _req,
    res: _res,
    env,
    ctx,
    data
  }).then((res) => {
    logWorkerEnd(req, res)
    return res
  })
})

const isProduction = process.env.NODE_ENV === 'production'

startServer()

async function startServer() {
  const app = express()

  app.use(compression())
  app.use('/api', apiAdapter)

  // Vite integration
  if (isProduction) {
    // In production, we need to serve our static assets ourselves.
    // (In dev, Vite's middleware serves our static assets.)
    const sirv = (await import('sirv')).default
    app.use(sirv(`${root}/build/client`))
  } else {
    // We instantiate Vite's development server and integrate its middleware to our server.
    // ⚠️ We instantiate it only in development. (It isn't needed in production and it
    // would unnecessarily bloat our production server.)
    const vite = await import('vite')
    console.log(
      colors.green(`[server] [vike] [startServer] -> vite.createServer`) +
        `({ root: ${colors.yellow(root)}, server: { middlewareMode: true } })`
    )
    const viteDevMiddleware = (
      await vite.createServer({
        root,
        server: { middlewareMode: true }
      })
    ).middlewares
    app.use(viteDevMiddleware)
  }

  // ...
  // Other middlewares (e.g. some RPC middleware such as Telefunc)
  // ...

  // Vike middleware. It should always be our last middleware (because it's a
  // catch-all middleware superseding any middleware placed after it).
  app.get('*', async (req, res, next) => {
    console.log(colors.green(`[server] [vike] [startServer] -> app.get('*')`))
    const headers = new Headers(mapHttpHeaders(req.headers).mappedHeaders)
    headers.delete('upgrade-insecure-requests')
    headers.set('sec-fetch-dest', 'cors')
    headers.set('accept', '*/*')
    // console.log(colors.green(`[server] [vike] [startServer] -> headers:`))
    // console.log(headers)

    const _req = new Request(new URL(req.url, 'http://' + req.headers.host), {
      method: req.method,
      headers
    }) as unknown as Request
    const _res = new Response() as unknown as Response
    const session = await getSession(_req, _res, env, ctx)
    logger.info(`[api] [ssr] handleSsr -> session ->`)
    logger.info(session)

    const cookieHeader = req.headers.cookie || ''
    logger.debug(`[api] [ssr] handleSsr -> cookieHeader -> ${cookieHeader}`)
    const { sessionToken, csrfToken, callbackUrl, pkceCodeVerifier } = getAuthCookies(cookieHeader)
    logger.debug(`[api] [ssr] handleSsr -> sessionToken -> ${sessionToken}`)

    const pageContextInit = {
      urlOriginal: req.originalUrl,
      session,
      sessionToken
    }
    console.log(colors.green(`[server] [vike] [startServer] -> renderPage(pageContextInit)`))
    console.log(
      colors.green(
        `[server] [vike] [startServer] -> pageContextInit.urlOriginal: ${pageContextInit.urlOriginal}`
      )
    )
    const pageContext = await renderPage(pageContextInit)
    // console.log(colors.green(`[server] [vike] [startServer] -> pageContext:`))
    // console.log(pageContext)
    const { httpResponse } = pageContext
    if (!httpResponse) {
      return next()
    } else {
      const { statusCode, headers, earlyHints } = httpResponse
      // console.log(httpResponse)
      if (res.writeEarlyHints) res.writeEarlyHints({ link: earlyHints.map((e) => e.earlyHintLink) })
      if (headers) headers.forEach(([name, value]) => res.setHeader(name, value))
      res.status(statusCode)
      // For HTTP streams use httpResponse.pipe() instead, see https://vike.dev/stream
      httpResponse.pipe(res)
      // res.send(body)
    }
  })

  app.listen(PORT, HOST)
  logger.info(`Server running at http://${HOST}:${PORT}/`)
  logger.info(`[server] [simple] [nodeEnv] -> ${nodeEnv}`)
  logger.info(`[server] [simple] [isSsr] -> ${isSsr}`)
  logger.info(`[server] [simple] [envLogLevel] -> ${envLogLevel}`)
  const openapi_schema = router.schema
  const schemaPath = `${__appDir}/api/openapi.json`
  fs.writeFileSync(schemaPath, JSON.stringify(openapi_schema, null, 2))
  logger.info(`[server] [simple] [openapi_schema] -> written to ${schemaPath}`)
}
