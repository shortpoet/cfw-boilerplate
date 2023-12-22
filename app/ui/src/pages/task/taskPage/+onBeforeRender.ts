// https://vike.dev/onBeforeRender
export { onBeforeRender };

import type { OnBeforeRenderAsync } from 'vike/types';
import { QueryClient, dehydrate } from '@tanstack/vue-query';
import { UserRole } from '#/types';
// import { getTaskList } from '../taskList';

const onBeforeRender: OnBeforeRenderAsync = async (
  pageContext
): ReturnType<OnBeforeRenderAsync> => {
  const user = pageContext.session?.user;
  const { urlPathname, csrfToken, sessionToken, callbackUrl } = pageContext;
  console.log(`[ui] [task] [index] [onBeforeRender] urlPathname: ${urlPathname}`);
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 5000 } },
  });
  const { routeParams } = pageContext;

  const page = parseInt(routeParams.taskPage) || 8;

  console.log(`[ui] [task] [index] [onBeforeRender] prequery:`);
  await queryClient.prefetchQuery({
    queryKey: ['result', page],
    // queryFn: () => getTaskList(page),
    queryFn: ({ queryKey }) => TasksService.getTaskList({ page: queryKey[1] as number }),
  });
  const vueQueryState = dehydrate(queryClient);

  return {
    pageContext: {
      pageProps: {
        isAdmin: user?.roles.includes(UserRole.Admin) || false,
        vueQueryState,
        page,
      },
      title: 'API Data',
    },
  };
};
