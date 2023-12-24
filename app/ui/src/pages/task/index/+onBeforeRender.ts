// https://vike.dev/onBeforeRender
export { onBeforeRender }

import type { OnBeforeRenderAsync } from 'vike/types'
import { QueryClient, dehydrate } from '@tanstack/vue-query'

import { UserRole } from '#/types'
// import { getTaskList } from '../taskList';

const onBeforeRender: OnBeforeRenderAsync = async (
  pageContext
): ReturnType<OnBeforeRenderAsync> => {
  const user = pageContext.session?.user
  const { urlPathname, csrfToken, sessionToken, callbackUrl } = pageContext
  console.log(`[ui] [task] [index] [onBeforeRender] urlPathname: ${urlPathname}`)
  const queryClient = new QueryClient({
    // defaultOptions: { queries: { staleTime: 50000 } }
  })
  const { routeParams } = pageContext

  const page = parseInt(routeParams.taskPage) || 8
  const limit = 0
  let vueQueryState

  console.log(`[ui] [task] [index] [onBeforeRender] prequery: page: ${page}, limit: ${limit}`)
  await queryClient.prefetchQuery({
    queryKey: ['result', page, limit],
    // queryFn: () => getTaskList(page),
    queryFn: ({ queryKey }) =>
      TasksService.getTaskList({ page: queryKey[1] as number, limit: queryKey[2] as number }),
    staleTime: 1000 * 60 * 5 // 5 minutes
  })
  vueQueryState = dehydrate(queryClient)
  try {
  } catch (error) {}

  return {
    pageContext: {
      pageProps: {
        isAdmin: user?.roles.includes(UserRole.Admin) || false,
        vueQueryState,
        limit,
        page
      },
      title: 'API Data'
    }
  }
}
