var __defProp = Object.defineProperty
var __name = (target: any, value: any) => __defProp(target, 'name', { value, configurable: true })
// only for server/../vike.ts
// @ts-expect-error workaround for vite issue // https://github.com/vuejs/core/issues/8303
globalThis.__name = __name

import vue from '@vitejs/plugin-vue'
import vike from 'vike/plugin'
import Unocss from 'unocss/vite'
import Markdown from 'unplugin-vue-markdown/vite'
import Shiki from 'markdown-it-shikiji'
import LinkAttributes from 'markdown-it-link-attributes'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import path from 'node:path'
import { defineConfig, loadEnv, UserConfig } from 'vite'
import { InlineConfig } from 'vitest'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import WebfontDownload from 'vite-plugin-webfont-dl'

import { getConfig } from './config'

interface VitestConfigExport extends UserConfig {
  test: InlineConfig
}
const vitestConfig: InlineConfig = {
  include: ['test/**/*.test.ts'],
  environment: 'jsdom',
  deps: {
    inline: ['@vue', '@vueuse', 'vue-demi']
  }
}

export default ({ mode }: { mode: string }) => {
  const { envDir, parsedSecret, parsed, SSL_CERT, SSL_KEY } = getConfig(mode)
  console.log(`[ui] [vite] loading... (${mode})`)
  const loaded = loadEnv(mode, envDir, '')
  // console.log('[ui] [vite] loaded: ', loaded);
  // console.log('[ui] [vite] parsedSecret: ', parsedSecret);
  // console.log('[ui] [vite] process.env: ', parsed);
  const env = { ...parsed, ...loaded, ...parsedSecret }
  const processEnvValues = {
    'process.env': Object.entries(env).reduce(
      (prev, [key, val]) => {
        return {
          ...prev,
          [key]: val
        }
      },
      {
        __VUE_OPTIONS_API__: JSON.stringify(true),
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false)
      }
    )
  }
  // console.log('[ui] [vite] processEnvValues: ', processEnvValues);
  return defineConfig({
    envDir,
    define: processEnvValues,
    plugins: [
      vue({
        include: [/\.vue$/, /\.md$/]
      }),
      vike({ prerender: true }),
      nodePolyfills({
        // To add only specific polyfills, add them here. If no option is passed, adds all polyfills
        include: ['path', 'url'],
        // To exclude specific polyfills, add them to this list. Note: if include is provided, this has no effect
        exclude: [
          // 'http', // Excludes the polyfill for `http` and `node:http`.
        ],
        // Whether to polyfill specific globals.
        globals: {
          Buffer: true, // can also be 'build', 'dev', or false
          global: true,
          process: true
        },
        // Override the default polyfills for specific modules.
        overrides: {
          // Since `fs` is not supported in browsers, we can use the `memfs` package to polyfill it.
          fs: 'memfs'
        },
        // Whether to polyfill `node:` protocol imports.
        protocolImports: true
      }),
      AutoImport({
        imports: [
          'vue',
          'vue/macros',
          // '@vueuse/core',
          '@vueuse/head'
          // 'vue-demi'
        ],
        exclude: [],
        dts: 'src/auto-imports.d.ts',
        dirs: [
          'src/composables/**',
          'src/core/**',
          'src/models/**',
          'src/modules/**',
          'src/services/**',
          'src/stores/**'
        ],
        vueTemplate: true
      }),
      Unocss(),
      Icons({
        /* options */
      }),
      Components({
        dirs: ['src/components', 'src/layouts'],
        extensions: ['vue'],
        include: [/\.vue$/, /\.vue\?vue/],
        dts: 'src/components.d.ts',
        resolvers: [
          IconsResolver({
            // // componentPrefix: 'icon',
            // enabledCollections: [
            //   'carbon'
            //   //  'fa', 'mdi', 'eva', 'entypo', 'feather', 'heroicons'
            // ]
          })
        ]
      }),
      Markdown({
        wrapperClasses: 'prose prose-sm m-auto text-left',
        headEnabled: true,
        async markdownItSetup(md: any) {
          md.use(LinkAttributes, {
            matcher: (link: string) => /^https?:\/\//.test(link),
            attrs: {
              target: '_blank',
              rel: 'noopener'
            }
          })
          md.use(
            await Shiki({
              defaultColor: false,
              themes: {
                light: 'vitesse-light',
                dark: 'vitesse-dark'
              }
            })
          )
        }
      }),
      // https://github.com/feat-agency/vite-plugin-webfont-dl
      WebfontDownload()
    ],
    server: {
      // port: parseInt(env.VITE_PORT || '3000'),
      hmr: {
        overlay: false
      },
      https: {
        key: SSL_KEY,
        cert: SSL_CERT
      }
      // to avoid CORS issues
      // proxy: {
      //   '/api': {
      //     target: 'http://localhost:3333',
      //     changeOrigin: true,
      //     rewrite: (path) => path.replace(/^\/api/, 'api'),
      //   },
      // },
    },

    optimizeDeps: {
      exclude: ['nprogress']
      // esbuildOptions: {
      //   // Node.js global to browser globalThis
      //   define: {
      //     global: 'globalThis',
      //   },
      //   // Enable esbuild polyfill plugins
      //   plugins: [
      //     NodeGlobalsPolyfillPlugin({
      //       process: true,
      //       buffer: true,
      //     }),
      //     NodeModulesPolyfillPlugin(),
      //   ],
      // },
    },
    // build: {
    //   rollupOptions: {
    //     plugins: [
    //       // Enable rollup polyfills plugin
    //       // used during production bundling
    //       rollupNodePolyFill(),
    //     ],
    //   },
    // },

    resolve: {
      alias: {
        '#': path.resolve(__dirname, '..')
      }
    },

    build: {
      outDir: 'build',
      target: 'esnext'
      // rollupOptions: {
      //   plugins: [
      //     injectRp.default.bind({
      //       Buffer: ['Buffer', 'Buffer'],
      //       process: ['process', 'process'],
      //       url: ['url', 'url'],
      //     }),
      //   ],
      // },
    },
    test: vitestConfig
  })
}
