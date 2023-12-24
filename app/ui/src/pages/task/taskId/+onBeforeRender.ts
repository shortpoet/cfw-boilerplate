// https://vike.dev/onBeforeRender
export { onBeforeRender }

import type { OnBeforeRenderAsync } from 'vike/types'
import { QueryClient, dehydrate } from '@tanstack/vue-query'
import { UserRole } from '#/types'

const onBeforeRender: OnBeforeRenderAsync = async (
  pageContext
): ReturnType<OnBeforeRenderAsync> => {
  const user = pageContext.session?.user
  const { urlPathname, csrfToken, sessionToken, callbackUrl } = pageContext
  console.log(`[ui] [task] [taskPage] [onBeforeRender] urlPathname: ${urlPathname}`)
  const queryClient = new QueryClient({
    // defaultOptions: { queries: { staleTime: 50000 } }
  })
  const { routeParams } = pageContext

  const taskId = routeParams.taskId

  console.log(`[ui] [task] [index] [onBeforeRender] prequery:`)
  await queryClient.prefetchQuery({
    queryKey: ['result', taskId],
    queryFn: ({ queryKey }) => TasksService.getTaskFetch({ taskId: queryKey[1] })
  })
  const vueQueryState = dehydrate(queryClient)

  return {
    pageContext: {
      pageProps: {
        isAdmin: user?.roles.includes(UserRole.Admin) || false,
        vueQueryState,
        taskId
      },
      title: 'API Data'
    }
  }
}
