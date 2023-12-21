// https://vike.dev/onBeforeRender
export { onBeforeRender };

import type { OnBeforeRenderAsync } from 'vike/types';
import { QueryClient, dehydrate } from '@tanstack/vue-query';
import { UserRole } from '#/types';
import { TasksService } from '../../services/TasksService';

export const getTaskList = async (page: number) => {
  const { urlBaseApi } = useBaseUrl();
  const url = `${urlBaseApi}/api/task/tasks?page=${page}`;
  console.log(`[ui] [task] [index] [onBeforeRender] fetching url: ${url}`);
  const response = await fetch(url);
  const data = await response.json();
  console.log(`[ui] [task] [index] [onBeforeRender] data:`);
  console.log(data);
  return data;
};

const onBeforeRender: OnBeforeRenderAsync = async (
  pageContext
): ReturnType<OnBeforeRenderAsync> => {
  const user = pageContext.session?.user;
  const { urlPathname, csrfToken, sessionToken, callbackUrl } = pageContext;
  console.log(`[ui] [task] [index] [onBeforeRender] urlPathname: ${urlPathname}`);
  const { characterId } = pageContext.routeParams;
  const queryClient = new QueryClient();
  const { routeParams } = pageContext;

  const page = parseInt(routeParams.taskPage) || 8;

  console.log(`[ui] [task] [index] [onBeforeRender] prequery:`);
  await queryClient.prefetchQuery({
    queryKey: ['result', page],
    // queryFn: () => getTaskList(page),
    queryFn: ({ queryKey }) =>
      TasksService.getTaskList({ page: queryKey[1] as number }).then((response) => response),
  });

  // const check = queryClient.ensureQueryData({
  //   queryKey: ['result', page],
  // });

  // console.log(`[ui] [task] [index] [onBeforeRender] check:`);
  // console.log(check);

  const vueQueryState = dehydrate(queryClient);
  // console.log(`[ui] [task] [index] [onBeforeRender] vueQueryState:`);
  // console.log(vueQueryState);
  console.log(`[ui] [task] [index] [onBeforeRender] tasks:`);
  console.log(`[ui] [task] [index] [onBeforeRender] tasks:`);
  console.log(`[ui] [task] [index] [onBeforeRender] tasks:`);
  const tasksFetch = await getTaskList(page);
  const tasksService = await TasksService.getTaskList({ page });
  console.log(`[ui] [task] [index] [onBeforeRender] tasksFetch:`);
  console.log(tasksFetch);
  console.log(`[ui] [task] [index] [onBeforeRender] tasksService:`);
  console.log(tasksService);

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
