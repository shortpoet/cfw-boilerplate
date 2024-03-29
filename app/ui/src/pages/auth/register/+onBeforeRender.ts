// https://vike.dev/onBeforeRender
export { onBeforeRender }

import type { OnBeforeRenderAsync, PageContextBuiltInServer } from 'vike/types'
import { render, redirect } from 'vike/abort'
import { UserRole } from '#/types'

const onBeforeRender: OnBeforeRenderAsync = async (
  pageContext
): ReturnType<OnBeforeRenderAsync> => {
  const {
    urlPathname,
    csrfToken,
    sessionToken: _sessionToken,
    callbackUrl,
    session: pageSession
  } = pageContext
  const sessionToken = _sessionToken || pageSession?.sessionId
  // fetch not loading on cloudflare
  // const session = await useSession(sessionToken);
  const session = pageSession

  console.log(`[ui] [auth] [login] [onBeforeRender] urlPathname and session: ${urlPathname}`)
  console.log(session)

  return {
    pageContext: {
      pageProps: {
        // title: 'Login / Logout',
        isAdmin: session?.user?.roles.includes(UserRole.Admin) || false,
        session: session
      }
      // title: 'API Data'
    }
  }
}
