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
const conf = dotenv.config({ path: `${__appDir}/.env` });
const parsed = conf.parsed;
const vars = dotenv.config({ path: `${__wranglerDir}/.dev.vars` });
const parsedDev = vars.parsed;
if (!parsed || !parsedDev) {
  const which = [!parsed, !parsedDev];
  throw new Error(`[server] missing env vars -> \n\t\t[.env, .dev.vars] -> ${which}]`);
}
const HOST: string = process.env.HOST || 'localhost';
const PORT: number = parseInt(process.env.PORT || '3333');
const SECRET: string = process.env.NEXTAUTH_SECRET || '';
const GITHUB_CLIENT_ID: string = process.env.GITHUB_CLIENT_ID || '';
const GITHUB_CLIENT_SECRET: string = process.env.GITHUB_CLIENT_SECRET || '';
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

  if (req.url) {
    const { mappedHeaders, contentType } = mapHttpHeaders(req.headers);
    serverLogStart(req, contentType ?? '');
    // console.log(req);
    const apiReq = new Request(new URL(req.url, 'http://' + req.headers.host), {
      method: req.method,
      headers: mappedHeaders,
      // body: req.read(),
    });
    const data = req.read();
    const response = new Response();
    // const response = new Response("", { cf: req.cf });
    const resp = await Api.handle(apiReq, response, process.env, ctx, data)
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
    console.log('[server] incomingHeaders', incomingHeaders);

    res.writeHead(resp.status, resp.statusText, incomingHeaders);

    res.end((await resp.text()) + '\n');

    res.on('finish', () => {
      serverLogEnd(req, res);
    });
  }
});

server.on('error', (e: NodeJS.ErrnoException) => {
  if (e.code === 'EADDRINUSE') {
    console.log('Address in use, retrying...');
    setTimeout(() => {
      server.close();
      server.listen(PORT, HOST);
    }, 1000);
  }
  console.error(e);
});

server.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}/`);
});
