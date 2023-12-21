import type { Config } from 'vike/types';
import {
  onHydrationEnd,
  onPageTransitionStart,
  onPageTransitionEnd,
} from './onPageTransitionHooks';

const passToClient = [
  'pageProps',
  'title',
  'documentProps',
  'routeParams',
  'session',
  'csrfToken',
  'callbackUrl',
  'redirectTo',
  'isAdmin',
  'cf',
  'sessionToken',
  'pkceCodeVerifier',
];

// https://vike.dev/config
export default {
  passToClient,
  clientRouting: true,
  prefetchStaticAssets: 'viewport',
  onHydrationEnd,
  onPageTransitionStart,
  onPageTransitionEnd,
  // https://vike.dev/meta
  meta: {
    // Create new config 'title'
    title: {
      env: { server: true, client: true },
    },
    // server false to prevent 522 on cloudflare
    // or use workers.dev url for api
    onBeforeRender: {
      env: { server: true, client: true },
    },
    // logger: {
    //   env: { server: true, client: true },
    // },
  },
} satisfies Config;
