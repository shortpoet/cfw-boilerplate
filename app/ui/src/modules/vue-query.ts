import type { App, InjectionKey } from 'vue';
import type { QueryClient } from '@tanstack/vue-query';
import { PageContext } from 'vike/types';

export const initialPage = 1;

export const VUE_QUERY_STATE: InjectionKey<QueryClient | undefined> = Symbol('VUE_QUERY_STATE');

export const provideVueQuery = (app: App, pageContext: PageContext) =>
  app.provide(VUE_QUERY_STATE, pageContext.pageProps?.vueQueryState);
