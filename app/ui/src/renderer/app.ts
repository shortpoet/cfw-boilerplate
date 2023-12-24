import { createSSRApp, defineComponent, h } from 'vue'
import { Component, PageContext, PageProps, Page } from '#/types'
import { StoreState } from 'pinia'
import { createHead } from '@vueuse/head'
import { VueQueryPlugin } from '@tanstack/vue-query'

import '@unocss/reset/tailwind.css'
import 'uno.css'
import '../styles/main.css'
import { UiState } from '#/types'
import { PageShell } from '../layouts'
import { initOpenAPI } from './openapi'

export { createApp, isClient, defaultWindow, getInitialStateUi }
const isClient = typeof window !== 'undefined'
const defaultWindow: (Window & typeof globalThis) | undefined = /* #__PURE__ */ isClient
  ? window
  : undefined

// const initialState = defaultWindow?.__INITIAL_STATE__;
const initialStateUi: StoreState<UiState> = {
  alaCartePath: ''
}

const getInitialStateUi = () => initialStateUi

function createApp(Page: Page, pageProps: PageProps | undefined, pageContext: PageContext) {
  const { session, csrfToken, callbackUrl, isAdmin, cf, sessionToken } = pageContext
  const { logger, correlationId } = useSsrLogger()
  logger.info(`[ui] [app] [createApp] sessionToken: ${sessionToken}`)
  logger.info(`[ui] [app] [createApp] correlationId: ${correlationId}`)
  logger.info(`[ui] [app] [createApp] session:`)
  logger.info(session)
  // console.log(`[ui] [app] [createApp] session:`);
  // console.log(session);
  let rootComponent: any
  // sxee comments below
  // let rootComponent: Component & { Page: Component; pageProps: PageProps };
  const PageWithWrapper = defineComponent({
    data: () => ({
      Page: markRaw(Page),
      pageProps: markRaw(pageContext.pageProps || {}),
      config: markRaw(pageContext.config),
      session,
      csrfToken,
      callbackUrl,
      isAdmin,
      cf
    }),
    created() {
      rootComponent = this
      // needing window defined
      provideLuciaAuth()
      provideLogger(import.meta.env as unknown as EnvVars)
      // provideNextAuth();
    },
    render() {
      // @ts-expect-error
      if (!!this.config.Layout) {
        return h(
          // @ts-expect-error
          this.config.Layout,
          {},
          {
            default: () => {
              // @ts-expect-error
              return h(this.Page, this.pageProps)
            }
          }
        )
      }
      return h(
        PageShell,
        {},
        {
          default: () => {
            // @ts-expect-error
            return h(this.Page, this.pageProps)
          }
        }
      )
    }
  })

  const app = createSSRApp(PageWithWrapper)
  app.config.errorHandler = onErrorClient

  app.use(createHead())
  installPinia(app, isClient, getInitialStateUi())
  app.use(VueQueryPlugin)
  provideFlashMessage(app)
  initOpenAPI()

  // We use `app.changePage()` to do Client Routing, see `_default.page.client.js`
  objectAssign(app, {
    changePage: (pageContext: PageContext) => {
      Object.assign(pageContextReactive, pageContext)
      rootComponent.Page = markRaw(pageContext.Page)
      rootComponent.pageProps = markRaw(pageContext.pageProps || {})
      rootComponent.config = markRaw(pageContext.config || PageShell)
      // ... from rootComponent
      // without the below line the layout only changes on reload, and then persists weirdly to other navigated pages
      // rootComponent.Layout = markRaw(pageContext.exports.Layout || PageShell);
      rootComponent.session = pageContext.session
      rootComponent.csrfToken = pageContext.csrfToken
      rootComponent.callbackUrl = pageContext.callbackUrl
      rootComponent.isAdmin = pageContext.isAdmin
      rootComponent.cf = pageContext.cf
    }
  })

  // When doing Client Routing, we mutate pageContext (see usage of `app.changePage()` in `_default.page.client.js`).
  // We therefore use a reactive pageContext.
  const pageContextReactive = reactive(pageContext)

  // Make `pageContext` accessible from any Vue component
  providePageContext(app, pageContextReactive)

  return app
}

// Same as `Object.assign()` but with type inference
function objectAssign<Obj extends object, ObjAddendum>(
  obj: Obj,
  objAddendum: ObjAddendum
): asserts obj is Obj & ObjAddendum {
  Object.assign(obj, objAddendum)
}
