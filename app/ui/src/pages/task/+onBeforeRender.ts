// https://vike.dev/onBeforeRender
export { onBeforeRender };

import type { OnBeforeRenderAsync } from 'vike/types';
import { QueryClient, dehydrate } from '@tanstack/vue-query';
import { UserRole } from '#/types';
import { TasksService } from '../../services/TasksService';

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
  const getTaskList = async () => {
    const response = await fetch('http://localhost:3000/api/task/tasks?page=2');
    const data = await response.json();
    console.log(`[ui] [task] [index] [onBeforeRender] data:`);
    console.log(data);
    return data;
  };

  await queryClient.prefetchQuery({
    queryKey: ['result', page],
    queryFn: () => TasksService.getTaskList({ page }),
  });

  // const check = queryClient.ensureQueryData({
  //   queryKey: ['result', page],
  // });

  // console.log(`[ui] [task] [index] [onBeforeRender] check:`);
  // console.log(check);

  const vueQueryState = dehydrate(queryClient);
  // console.log(`[ui] [task] [index] [onBeforeRender] vueQueryState:`);
  // console.log(vueQueryState);
  // console.log('tasks');
  // console.log(await TasksService.getTaskList({ page }));

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
