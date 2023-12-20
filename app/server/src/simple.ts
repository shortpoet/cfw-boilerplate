import http from 'http';
import dotenv from 'dotenv';
import { error, json } from 'itty-router';
import path from 'node:path';
import { corsify, Api } from '@cfw-boilerplate/api/src/router';
import { mapHttpHeaders, serverLogStart, ctx, serverLogEnd } from './util';
import { __rootDir, __appDir, __wranglerDir } from '#/utils/root';
import { unstable_dev } from 'wrangler';
import type { UnstableDevWorker } from 'wrangler';
// const worker: UnstableDevWorker = await unstable_dev(`${__wranglerDir}/src/index.ts`, {
//   experimental: { disableExperimentalWarning: true },
// });
// const envDir = path.resolve(process.cwd(), '.');
// const __appDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
// const __wranglerDir = path.resolve(__appDir, 'api');

import { config } from '#/utils/config';
import { getCorrelationId, getLogger } from '#/utils/logger/logger';
const isSsr = config.env.SSR;
const nodeEnv = config.env.NODE_ENV;
const envLogLevel = config.env.VITE_LOG_LEVEL;

const logger = getLogger({ isSsr, nodeEnv, envLogLevel });

const HOST: string = config.env.HOST || '127.0.0.1';
const PORT: number = parseInt(config.env.PORT || '3333');
const SECRET: string = config.env.NEXTAUTH_SECRET || '';
const GITHUB_CLIENT_ID: string = config.env.GITHUB_CLIENT_ID || '';
const GITHUB_CLIENT_SECRET: string = config.env.GITHUB_CLIENT_SECRET || '';
if (!SECRET || !GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
  const which = [!SECRET, !GITHUB_CLIENT_ID, !GITHUB_CLIENT_SECRET]
    .map((b) => b.toString())
    .filter(Boolean)
    .join(', ');
  throw new Error(
    `[server] auth.config -> missing secret or env vars -> \n\t\t[NEXTAUTH_SECRET, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET] -> ${which}]`
  );
}

const server = http.createServer(async (req, res) => {
  res.on('error', (err) => {
    console.error(err);
    res.statusCode = 500;
    res.end(err);
  });

  const { mappedHeaders, contentType } = mapHttpHeaders(req.headers);
  if (req.url) {
    logger.child({
      correlationId: getCorrelationId(new Headers(mappedHeaders)),
    });
    logger.info(`[server] req.url: ${req.url}`);
    serverLogStart(req, contentType ?? '');
    // console.log(req);
    console.log(`[server] [simple] -> mappedHeaders -> ${JSON.stringify(mappedHeaders, null, 2)}`);
    const apiReq = new Request(new URL(req.url, 'http://' + req.headers.host), {
      method: req.method,
      headers: mappedHeaders,
      // body: req.read(),
    });
    const data = req.read();
    const response = new Response();
    // const response = new Response("", { cf: req.cf });
    console.log(`[server] [simple] -> apiReq -> ${config.env.__appDir}`);
    console.log(`[server] [simple] -> apiReq -> ${config.env.__wranglerDir}`);
    // @ts-expect-error
    const resp = await Api.handle(apiReq, response, config.env, ctx, data)
      .then(json)
      .catch(error)
      .then(corsify);

    // const resp = await worker.fetch(new URL(req.url, 'http://' + req.headers.host), {
    //   method: req.method,
    //   headers: mappedHeaders,
    //   duplex: 'half',
    //   // body: req.read(),
    // });

    if (!resp) {
      res.statusCode = 404;
      res.end('Not Found');
      return;
    }

    const incomingHeaders = Array.from(resp.headers.entries()) as any;
    logger.debug(`server] incomingHeaders -> ${JSON.stringify(incomingHeaders, null, 2)}`);

    res.writeHead(resp.status, resp.statusText, incomingHeaders);

    res.end((await resp.text()) + '\n');

    res.on('finish', () => {
      serverLogEnd(req, res);
    });
  }
});

server.on('error', (e: NodeJS.ErrnoException) => {
  if (e.code === 'EADDRINUSE') {
    logger.warn('Address in use, retrying...');
    setTimeout(() => {
      server.close();
      server.listen(PORT, HOST);
    }, 1000);
  }
  console.error(e);
});

server.listen(PORT, HOST, () => {
  logger.info(`Server running at http://${HOST}:${PORT}/`);
});
