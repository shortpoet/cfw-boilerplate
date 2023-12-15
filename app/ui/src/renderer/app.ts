import { createSSRApp, defineComponent, h } from 'vue';
import { Component, PageContext, PageProps, Page } from '@cfw-boilerplate/types';
import '@unocss/reset/tailwind.css';
import 'uno.css';
import '../styles/main.css';
import { PageShell } from '../layouts';
import { install as installPinia } from '../modules/pinia';
import { StoreState } from 'pinia';
import { UiState } from '../stores';
import { createHead } from '@vueuse/head';

export { createApp, isClient, defaultWindow, getInitialStateUi };
const isClient = typeof window !== 'undefined';
const defaultWindow: (Window & typeof globalThis) | undefined = /* #__PURE__ */ isClient
  ? window
  : undefined;

// const initialState = defaultWindow?.__INITIAL_STATE__;
const initialStateUi: StoreState<UiState> = {
  alaCartePath: '',
};

const getInitialStateUi = () => initialStateUi;

function createApp(Page: Page, pageProps: PageProps | undefined, pageContext: PageContext) {
  const { session, csrfToken, callbackUrl, isAdmin, cf } = pageContext;

  let rootComponent: any;
  // sxee comments below
  // let rootComponent: Component & { Page: Component; pageProps: PageProps };
  const PageWithWrapper = defineComponent({
    data: () => ({
      Page: markRaw(Page),
      pageProps: markRaw(pageProps || {}),
      Layout: markRaw(pageContext.exports.Layout || PageShell),
      session,
      csrfToken,
      callbackUrl,
      isAdmin,
      cf,
    }),
    created() {
      rootComponent = this;
    },
    render() {
      return h(
        PageShell,
        {},
        {
          default: () => {
            // @ts-ignore
            return h(this.Page, this.pageProps);
          },
        }
      );
    },
  });

  const app = createSSRApp(PageWithWrapper);
  installPinia(app, isClient, getInitialStateUi());

  // We use `app.changePage()` to do Client Routing, see `_default.page.client.js`
  objectAssign(app, {
    changePage: (pageContext: PageContext) => {
      Object.assign(pageContextReactive, pageContext);
      rootComponent.Page = markRaw(pageContext.Page);
      rootComponent.pageProps = markRaw(pageContext.pageProps || {});
      // ... from rootComponent
      // without the below line the layout only changes on reload, and then persists weirdly to other navigated pages
      rootComponent.Layout = markRaw(pageContext.exports.Layout || PageShell);
      rootComponent.session = pageContext.session;
      rootComponent.csrfToken = pageContext.csrfToken;
      rootComponent.callbackUrl = pageContext.callbackUrl;
      rootComponent.isAdmin = pageContext.isAdmin;
      rootComponent.cf = pageContext.cf;
    },
  });

  // When doing Client Routing, we mutate pageContext (see usage of `app.changePage()` in `_default.page.client.js`).
  // We therefore use a reactive pageContext.
  const pageContextReactive = reactive(pageContext);

  // Make `pageContext` accessible from any Vue component
  setPageContext(app, pageContextReactive);
  app.use(createHead());

  return app;
}

// Same as `Object.assign()` but with type inference
function objectAssign<Obj extends object, ObjAddendum>(
  obj: Obj,
  objAddendum: ObjAddendum
): asserts obj is Obj & ObjAddendum {
  Object.assign(obj, objAddendum);
}
