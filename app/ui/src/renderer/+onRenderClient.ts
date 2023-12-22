// https://vike.dev/onRenderClient
export { onRenderClient };

import { createApp } from './app';
import type { OnRenderClientAsync } from 'vike/types';

// This onRenderClient() hook only supports SSR, see https://vike.dev/render-modes for how to modify onRenderClient()
// to support SPA
let app: ReturnType<typeof createApp>;

const onRenderClient: OnRenderClientAsync = async (
  pageContext
): ReturnType<OnRenderClientAsync> => {
  const { Page, pageProps } = pageContext;
  if (!Page) throw new Error('Client-side render() hook expects pageContext.Page to be defined');
  if (!app) {
    app = createApp(Page, pageProps, pageContext);
    provideVueQuery(app, pageContext);
    app.mount('#app');
  } else {
    app.changePage(pageContext);
  }
  document.title = usePageTitle(pageContext).title;
};
