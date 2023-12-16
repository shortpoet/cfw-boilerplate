// https://vike.dev/onBeforeRender
export { onBeforeRender };

import type { OnBeforeRenderAsync } from 'vike/types';
import { render, redirect } from 'vike/abort';
import { UserRole } from '#/types';
import { RequestConfig, useFetch } from '../../../composables';

const onBeforeRender: OnBeforeRenderAsync = async (
  pageContext
): ReturnType<OnBeforeRenderAsync> => {
  const user = pageContext.session?.user;
  const { urlPathname, csrfToken, sessionToken, callbackUrl } = pageContext;
  console.log(`[ui] [api-data] [onBeforeRender] urlPathname: ${urlPathname}`);

  const endpoints = [
    { path: 'ala-carte', title: 'A la Carte' },
    { path: 'debug', title: 'Debug' },
    { path: 'health', title: 'Health' },
    { path: 'healthE', title: 'HealthE' },
    { path: 'hello', title: 'Hello' },
    { path: 'json-file', title: 'JSON File' },
  ];
  return {
    pageContext: {
      pageProps: {
        isAdmin: user?.roles.includes(UserRole.Admin) || false,
        endpoints,
      },
      title: 'API Data',
    },
  };
};
