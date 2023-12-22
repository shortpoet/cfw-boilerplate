// https://vike.dev/onRenderHtml
export { onRenderHtml };

import type { App } from 'vue';
import { renderToString as renderToString_ } from '@vue/server-renderer';
import { pipeToWebWritable, pipeToNodeWritable } from '@vue/server-renderer';
import { createHead, renderHeadToString } from '@vueuse/head';
import { dangerouslySkipEscape, escapeInject, stampPipe } from 'vike/server';
import type { OnRenderHtmlAsync } from 'vike/types';
import type { Writable } from 'stream';

import { createApp, getInitialStateUi } from './app';

const onRenderHtml: OnRenderHtmlAsync = async (pageContext): ReturnType<OnRenderHtmlAsync> => {
  const { session, cf, callbackUrl, csrfToken, isAdmin, Page, pageProps, redirectTo } = pageContext;
  // This onRenderHtml() hook only supports SSR, see https://vike.dev/render-modes for how to modify
  // onRenderHtml() to support SPA
  if (!Page) throw new Error('My render() hook expects pageContext.Page to be defined');
  const app = createApp(Page, pageProps, pageContext);
  provideVueQuery(app, pageContext);

  // See https://vike.dev/head
  const { documentProps } = pageContext.exports;
  // const title = (documentProps && documentProps.title) || 'Vite SSR app';
  // const desc = (documentProps && documentProps.description) || 'App using Vite + Vike';

  // const appHtml = await renderToString(app)

  // Streaming is optional: we can use renderToString() instead.
  const pipe = isWorker()
    ? (writable: WritableStream) => {
        pipeToWebWritable(app, {}, writable);
      }
    : // While developing, we use Vite's development sever instead of a Cloudflare worker. Instead of `pipeToNodeWritable()`, we could as well use `renderToString()`.
      (writable: Writable) => {
        pipeToNodeWritable(app, {}, writable);
        // dangerouslySkipEscape(appHtml)
      };
  stampPipe(pipe, isWorker() ? 'web-stream' : 'node-stream');

  const { headTags, htmlAttrs, bodyAttrs, bodyTags } = await renderHeadToString(createHead());

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en" ${htmlAttrs}>
    <head>
      ${headTags}
    </head>
    <body${bodyAttrs}>
      <div id="app">${pipe}</div>
      ${bodyTags}
    </body>
    </html>`;

  // if (redirectTo) {
  //   return {
  //     pageContext: { redirectTo },
  //   };
  // }

  return {
    documentHtml,
    pageContext: {
      enableEagerStreaming: true,
      initalStateUi: getInitialStateUi(),
      session,
      redirectTo,
      cf,
      callbackUrl,
      csrfToken,
      isAdmin,
      // title,
    },
  };
};

// https://github.com/cloudflare/wrangler2/issues/1481
// https://community.cloudflare.com/t/how-to-detect-the-cloudflare-worker-runtime/293715
function isWorker() {
  return (
    // @ts-ignore
    typeof WebSocketPair !== 'undefined' || typeof caches !== 'undefined'
  );
}
async function renderToString(app: App) {
  let err: unknown;
  // Workaround: renderToString_() swallows errors in production, see https://github.com/vuejs/core/issues/7876
  app.config.errorHandler = (err_) => {
    err = err_;
  };
  const appHtml = await renderToString_(app);
  if (err) throw err;
  return appHtml;
}
