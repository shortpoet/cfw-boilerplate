// https://vike.dev/onBeforeRender
export { onBeforeRender };

import type { OnBeforeRenderAsync, PageContextBuiltInServer } from 'vike/types';
import { render, redirect } from 'vike/abort';
import { UserRole } from '#/types';
import { RequestConfig, useFetch } from '../../../composables';
import { PATH_MAPPING } from '../index/endpoints';
import { QueryClient, dehydrate } from '@tanstack/vue-query';

const onBeforeRender: OnBeforeRenderAsync = async (
  pageContext
): ReturnType<OnBeforeRenderAsync> => {
  const pathMapping = PATH_MAPPING;
  const user = pageContext.session?.user;
  const { urlPathname, csrfToken, sessionToken, callbackUrl } = pageContext;
  console.log(`[ui] [api-data] [endpoint] [onBeforeRender] urlPathname: ${urlPathname}`);
  // const sessionToken = getCookie(LUCIAAUTH_COOKIES_SESSION_TOKEN);

  // overrides renderer/_default.page.server.ts
  const protectedRoutes = [
    '',
    // '/api-data/debug',
  ];

  let redirectTo = undefined;
  if (protectedRoutes.includes(urlPathname) && !user) {
    // console.log(`[ui] [api-data] [onBeforeRender] !user && protectedRoutes.includes(urlPathname)`);
    redirectTo = user ? undefined : '/auth/login';
    throw render('/auth/login');
  }
  // console.log(
  //   `[ui] [api-data] [onBeforeRender] redirectTo ${JSON.stringify({ redirectTo }, null, 2)}`
  // );

  let { dataLoading, error, data } = {
    dataLoading: ref(false),
    error: ref(),
    data: ref(),
  };
  if (pathMapping[urlPathname]) {
    const opts = {
      ...pathMapping[urlPathname].options,
      csrfToken,
      sessionToken,
      callbackUrl,
      headers: {
        ...pathMapping[urlPathname].options.headers,
        'X-CSRF-Token': csrfToken,
        // 'authjs.csrf-token': csrfToken,
        // 'authjs.session-token': sessionToken,
      },
    } as RequestConfig;
    // console.log(`[ui] [api-data] [onBeforeRender] opts`);
    ({ dataLoading, error, data } = await useFetch(pathMapping[urlPathname].route, opts));

    if (error.value) {
      console.error(`[ui] [api-data] [onBeforeRender] error:`);
      console.error(error.value);
      if (error.value.status === 401) {
        throw render(401, {
          noSession: true,
          notAdmin: !user?.roles.includes(UserRole.Admin),
          message: 'Only logged in users are allowed to access this page.',
        });
      }
      if (error.value.status === 403) {
        throw render(403, {
          noSession: false,
          notAdmin: !user?.roles.includes(UserRole.Admin),
          message: 'Only admins are allowed to access this page.',
        });
      }
    }
  }
  const queryClient = new QueryClient();
  // await queryClient.prefetchQuery(['characters', characterId], () => getCharacter(characterId))
  const vueQueryState = dehydrate(queryClient);

  return {
    pageContext: {
      redirectTo,
      pageProps: {
        title: 'API Data',
        isAdmin: user?.roles.includes(UserRole.Admin) || false,
        apiData: data.value,
        apiDataLoading: dataLoading.value,
        apiDataError: error.value,
        vueQueryState,
      },
      title: 'API Data',
    },
  };
};
