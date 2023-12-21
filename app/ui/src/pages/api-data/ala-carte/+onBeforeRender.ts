// https://vike.dev/onBeforeRender
export { onBeforeRender };

import type { OnBeforeRenderAsync } from 'vike/types';
import { QueryClient, dehydrate } from '@tanstack/vue-query';
import { UserRole } from '#/types';

const onBeforeRender: OnBeforeRenderAsync = async (
  pageContext
): ReturnType<OnBeforeRenderAsync> => {
  const user = pageContext.session?.user;
  const { urlPathname, csrfToken, sessionToken, callbackUrl } = pageContext;
  console.log(`[ui] [api-data] [ala-carte] [onBeforeRender] urlPathname: ${urlPathname}`);

  const queryClient = new QueryClient();
  const vueQueryState = dehydrate(queryClient);
  return {
    pageContext: {
      pageProps: {
        isAdmin: user?.roles.includes(UserRole.Admin) || false,
        vueQueryState,
      },
      title: 'API Data',
    },
  };
};
