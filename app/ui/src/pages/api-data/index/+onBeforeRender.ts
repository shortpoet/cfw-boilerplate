// https://vike.dev/onBeforeRender
export { onBeforeRender }

import type { OnBeforeRenderAsync } from 'vike/types'
import { QueryClient, dehydrate } from '@tanstack/vue-query'

import { UserRole } from '#/types'
import { ROUTE_MAPPING } from '../../routeMapping'

const onBeforeRender: OnBeforeRenderAsync = async (
  pageContext
): ReturnType<OnBeforeRenderAsync> => {
  const user = pageContext.session?.user
  const { urlPathname, csrfToken, sessionToken, callbackUrl } = pageContext
  console.log(`[ui] [api-data] [index] [onBeforeRender] urlPathname: ${urlPathname}`)
  // console.log(`[ui] [api-data] [index] [onBeforeRender] pagecontext endpoints`)
  // console.log(pageContext.endpoints)

  const endpoints = pageContext.endpoints || Object.values(ROUTE_MAPPING)
  // console.log(`[ui] [api-data] [index] [onBeforeRender] endpoints`)
  // console.log(endpoints)

  const queryClient = new QueryClient()
  // await queryClient.prefetchQuery(['characters', characterId], () => getCharacter(characterId))
  const vueQueryState = dehydrate(queryClient)

  // console.log(`[ui] [api-data] [onBeforeRender] endpoints`);
  // console.log(endpoints);
  return {
    pageContext: {
      pageProps: {
        isAdmin: user?.roles.includes(UserRole.Admin) || false,
        endpoints
        // vueQueryState
      },
      title: 'API Data'
    }
  }
}
