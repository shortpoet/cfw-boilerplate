import esbuild from 'esbuild';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import { polyfillNode } from 'esbuild-plugin-polyfill-node';
import brode from '@geut/esbuild-plugin-brode';
import fs from 'node:fs';
import { join } from 'node:path';

const __filename = (await import('node:url')).fileURLToPath(import.meta.url);
const __dirname = (await import('node:path')).dirname(__filename);
const __appDir = join(__dirname, '../../..');

const localPkgJson = JSON.parse(fs.readFileSync(`${__appDir}/api/package.json`, 'utf-8'));

async function buildWorker({ entry, out, debug, external } = {}) {
  const plugins = [
    // brode(),
    polyfillNode({
      // if running on node <= 18, you need to set this to match 
      // import 'lucia/polyfill/node' in api/../lucia.ts
      // polyfills: {
      //   crypto: true,
      // },
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
    metafile: true,
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
  return await esbuild.build(define);
}

build(getArgs());

export async function build({ entry, out, debug, metaOut }) {
  const external = Object.keys({
    // ...(localPkgJson.dependencies || {}),
    ...(localPkgJson.devDependencies || {}),
    ...(localPkgJson.peerDependencies || {})
  }).concat([
    // "@vueuse/core",
    // "vue-demi",
    // "node:fs",
    // "node:util",
    // "node:stream",
    // "node:buffer",
    // "node:http",
    // 'node:url',
    // 'node:crypto',
    '__STATIC_CONTENT_MANIFEST',
  ])

  console.log('[build-worker] Building worker...');
  // const args = getArgs();
  const config = {
    entry,
    out,
    metaOut,
    debug,
    external,
  };
  try {
    const metaJson = await buildWorker(config);
    const inputs = metaJson['metafile'].outputs['../api/build/worker.mjs'].inputs

    const sorted = Object.entries(inputs).map(([k, v]) => {
      return {
        file: k,
        bytes: v.bytesInOutput,
      }
    }).sort((a, b) => {
      return b.bytes - a.bytes
    })
    const sortedFileName = 'sorted.json'
    const base = metaOut.split('/').slice(0, -1).join('/')
    const sortedFile = `${base}/${sortedFileName}`

    console.log('[build-worker] Worker built successfully.');
    fs.writeFileSync(metaOut, JSON.stringify(metaJson, null, 2));

    console.log(`[build-worker] Metafile written to ${metaOut}.`);
    fs.writeFileSync(sortedFile, JSON.stringify(sorted, null, 2));

  } catch (err) {
    console.error('[build-worker] Failed to build worker.', err);
  }
}

function getArgs() {
  let entry;
  let out;
  let metaOut;
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
    if (arg === '--meta-out') {
      state = 'META_OUT';
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
    if (state === 'META_OUT') {
      metaOut = arg;
      state = null;
    }
  }

  if (!entry) {
    throw new Error('[build-worker] CLI argument --entry missing.');
  }
  if (!out) {
    throw new Error('[build-worker] CLI argument --out missing.');
  }
  if (!metaOut) {
    throw new Error('[build-worker] CLI argument --meta-out missing.');
  }

  return { entry, out, debug, metaOut };
}
