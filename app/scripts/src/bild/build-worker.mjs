import esbuild from 'esbuild';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import { polyfillNode } from 'esbuild-plugin-polyfill-node';
import brode from '@geut/esbuild-plugin-brode';

function buildWorker({ entry, out, debug, external } = {}) {
  const plugins = [
    // brode(),
    polyfillNode({
      polyfills: {
        crypto: true,
      },
    }),
    // NodeModulesPolyfillPlugin(),
  ];
  const define = {
    plugins,
    platform: 'browser',
    conditions: ['worker', 'browser'],
    entryPoints: [entry],
    sourcemap: true,
    outfile: out,
    external,
    logLevel: 'error',
    format: 'esm',
    target: 'esnext',
    minify: !debug,
    bundle: true,
    // banner: {
    //   js: "const __filename = (await import('node:url')).fileURLToPath(import.meta.url);const __dirname = (await import('node:path')).dirname(__filename);",
    //   js: "const require = (await import('node:module')).createRequire(import.meta.url);const __filename = (await import('node:url')).fileURLToPath(import.meta.url);const __dirname = (await import('node:path')).dirname(__filename);",
    // },
    define: {
      IS_CLOUDFLARE_WORKER: 'true',
      __VUE_OPTIONS_API__: JSON.stringify(true),
      __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
    },
  };
  console.log('define', define);
  return esbuild.build(define);
}

build(getArgs());

export async function build({ entry, out, debug }) {
  const external = [
    // "@vueuse/core",
    // "vue-demi",
    // "node:fs",
    // "node:util",
    // "node:stream",
    // "node:buffer",
    // "node:http",
    // 'node:url',
    'node:crypto',
    '__STATIC_CONTENT_MANIFEST',
  ];

  console.log('[build-worker] Building worker...');
  // const args = getArgs();
  const config = {
    entry,
    out,
    debug,
    external,
  };
  try {
    await buildWorker(config);
    console.log('[build-worker] Worker built successfully.');
  } catch (err) {
    console.error('[build-worker] Failed to build worker.', err);
  }
}

function getArgs() {
  let entry;
  let out;
  let debug = false;

  const args = process.argv.filter(Boolean);
  let state = null;
  for (const arg of args) {
    if (arg === '--debug') {
      debug = true;
      continue;
    }
    if (arg === '--entry') {
      state = 'ENTRY';
      continue;
    }
    if (arg === '--out') {
      state = 'OUT';
      continue;
    }
    if (state === 'ENTRY') {
      entry = arg;
      state = null;
    }
    if (state === 'OUT') {
      out = arg;
      state = null;
    }
  }

  if (!entry) {
    throw new Error('[build-worker] CLI argument --entry missing.');
  }
  if (!out) {
    throw new Error('[build-worker] CLI argument --out missing.');
  }

  return { entry, out, debug };
}
