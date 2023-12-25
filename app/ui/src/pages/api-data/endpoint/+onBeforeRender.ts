// https://vike.dev/onBeforeRender
export { onBeforeRender }

import type { OnBeforeRenderAsync, PageContextBuiltInServer } from 'vike/types'
import { render, redirect } from 'vike/abort'
import { QueryClient, dehydrate } from '@tanstack/vue-query'

import { UserRole, RequestConfig } from '#/types'
import { PATH_MAPPING } from '../index/endpoints'

const onBeforeRender: OnBeforeRenderAsync = async (
  pageContext
): ReturnType<OnBeforeRenderAsync> => {
  const user = pageContext.session?.user
  const { urlPathname, csrfToken, sessionToken, callbackUrl } = pageContext
  console.log(`[ui] [api-data] [endpoint] [onBeforeRender] urlPathname: ${urlPathname}`)
  // const sessionToken = getCookie(LUCIAAUTH_COOKIES_SESSION_TOKEN);
  // overrides renderer/_default.page.server.ts
  const protectedRoutes = [
    ''
    // '/api-data/debug',
  ]
  let redirectTo = undefined
  if (protectedRoutes.includes(urlPathname) && !user) {
    redirectTo = user ? undefined : '/auth/login'
    throw render('/auth/login')
  }
  const opts = {
    ...PATH_MAPPING[urlPathname].options,
    csrfToken,
    sessionToken,
    callbackUrl,
    headers: {
      ...PATH_MAPPING[urlPathname].options.headers,
      'X-CSRF-Token': csrfToken
      // 'authjs.csrf-token': csrfToken,
      // 'authjs.session-token': sessionToken,
    }
  } as RequestConfig

  const { dataLoading, error, data } = await useFetch(PATH_MAPPING[urlPathname].route, opts)

  const queryClient = new QueryClient()

  const { urlBaseApi } = useBaseUrl()
  const url = `${urlBaseApi}/${PATH_MAPPING[urlPathname].route}`

  await queryClient.prefetchQuery({
    queryKey: ['todos'],
    queryFn: () => fetch(url, opts).then((res) => res.json())
  })
  const vueQueryState = dehydrate(queryClient)

  if (error.value) {
    console.error(`[ui] [api-data] [onBeforeRender] error:`)
    console.error(error.value)
    if (error.value.status === 401) {
      throw render(401, {
        noSession: true,
        notAdmin: !user?.roles.includes(UserRole.Admin),
        message: 'Only logged in users are allowed to access this page.'
      })
    }
    if (error.value.status === 403) {
      throw render(403, {
        noSession: false,
        notAdmin: !user?.roles.includes(UserRole.Admin),
        message: 'Only admins are allowed to access this page.'
      })
    }
  }

  return {
    pageContext: {
      redirectTo,
      pageProps: {
        title: 'API Data',
        isAdmin: user?.roles.includes(UserRole.Admin) || false,
        apiData: data.value,
        apiDataLoading: dataLoading.value,
        apiDataError: error.value,
        vueQueryState
      },
      title: 'API Data'
    }
  }
}
