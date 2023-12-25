// https://vike.dev/onBeforeRender
export { onBeforeRender }

import type { OnBeforeRenderAsync } from 'vike/types'

import { Todo, getTodos } from './todos'
import { QueryClient, dehydrate } from '@tanstack/vue-query'

const onBeforeRender: OnBeforeRenderAsync = async (
  pageContext
): ReturnType<OnBeforeRenderAsync> => {
  const { todos } = await getTodos()
  const { urlBaseApi } = useBaseUrl()
  const { data } = await useFetch<Todo[]>(`${urlBaseApi}/api/todos`)

  const queryClient = new QueryClient({
    // defaultOptions: { queries: { staleTime: 50000 } }
  })
  const { routeParams } = pageContext

  let vueQueryState

  await queryClient.prefetchQuery({
    queryKey: ['todos'],
    queryFn: () => getTodos()
  })
  vueQueryState = dehydrate(queryClient)

  return {
    pageContext: {
      pageProps: {
        todosProps: todos,
        todosFetchProps: data.value
      },
      title: 'Test'
    }
  }
}
