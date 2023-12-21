import type { InjectionKey } from 'vue';
import type { QueryClient } from '@tanstack/vue-query';

export const initialPage = 1;

export const VUE_QUERY_STATE: InjectionKey<QueryClient | undefined> = Symbol('VUE_QUERY_STATE');
