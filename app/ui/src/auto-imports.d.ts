/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// noinspection JSUnusedGlobalSymbols
// Generated by unplugin-auto-import
export {}
declare global {
  const $: typeof import('vue/macros')['$']
  const $$: typeof import('vue/macros')['$$']
  const $computed: typeof import('vue/macros')['$computed']
  const $customRef: typeof import('vue/macros')['$customRef']
  const $ref: typeof import('vue/macros')['$ref']
  const $shallowRef: typeof import('vue/macros')['$shallowRef']
  const $toRef: typeof import('vue/macros')['$toRef']
  const COOKIES_SESSION_TOKEN: typeof import('./composables/auth')['COOKIES_SESSION_TOKEN']
  const COOKIES_USER_TOKEN: typeof import('./composables/auth')['COOKIES_USER_TOKEN']
  const EffectScope: typeof import('vue')['EffectScope']
  const FetchError: typeof import('./composables/fetch')['FetchError']
  const Locale: typeof import('./composables/locales')['Locale']
  const RequestConfig: typeof import('./composables/fetch')['RequestConfig']
  const SESSION_TOKEN_EXPIRY: typeof import('./composables/auth')['SESSION_TOKEN_EXPIRY']
  const USE_FETCH_REQ_INIT: typeof import('./composables/fetch')['USE_FETCH_REQ_INIT']
  const UseFetchResult: typeof import('./composables/fetch')['UseFetchResult']
  const computed: typeof import('vue')['computed']
  const cookieOptions: typeof import('./composables/auth')['cookieOptions']
  const createApp: typeof import('vue')['createApp']
  const customRef: typeof import('vue')['customRef']
  const defineAsyncComponent: typeof import('vue')['defineAsyncComponent']
  const defineComponent: typeof import('vue')['defineComponent']
  const effectScope: typeof import('vue')['effectScope']
  const getCurrentInstance: typeof import('vue')['getCurrentInstance']
  const getCurrentScope: typeof import('vue')['getCurrentScope']
  const getI18n: typeof import('./composables/i18n')['getI18n']
  const getLocale: typeof import('./composables/locales')['getLocale']
  const h: typeof import('vue')['h']
  const inject: typeof import('vue')['inject']
  const isClient: typeof import('./composables/auth')['isClient']
  const isDark: typeof import('./composables/dark')['isDark']
  const isProxy: typeof import('vue')['isProxy']
  const isReactive: typeof import('vue')['isReactive']
  const isReadonly: typeof import('vue')['isReadonly']
  const isRef: typeof import('vue')['isRef']
  const markRaw: typeof import('vue')['markRaw']
  const nextTick: typeof import('vue')['nextTick']
  const onActivated: typeof import('vue')['onActivated']
  const onBeforeMount: typeof import('vue')['onBeforeMount']
  const onBeforeUnmount: typeof import('vue')['onBeforeUnmount']
  const onBeforeUpdate: typeof import('vue')['onBeforeUpdate']
  const onDeactivated: typeof import('vue')['onDeactivated']
  const onErrorCaptured: typeof import('vue')['onErrorCaptured']
  const onMounted: typeof import('vue')['onMounted']
  const onRenderTracked: typeof import('vue')['onRenderTracked']
  const onRenderTriggered: typeof import('vue')['onRenderTriggered']
  const onScopeDispose: typeof import('vue')['onScopeDispose']
  const onServerPrefetch: typeof import('vue')['onServerPrefetch']
  const onUnmounted: typeof import('vue')['onUnmounted']
  const onUpdated: typeof import('vue')['onUpdated']
  const pageContext: typeof import('./composables/index')['pageContext']
  const preferredDark: typeof import('./composables/dark')['preferredDark']
  const provide: typeof import('vue')['provide']
  const provideAuth: typeof import('./composables/auth')['provideAuth']
  const reactive: typeof import('vue')['reactive']
  const readonly: typeof import('vue')['readonly']
  const ref: typeof import('vue')['ref']
  const resolveComponent: typeof import('vue')['resolveComponent']
  const setPageContext: typeof import('./composables/pageContext')['setPageContext']
  const shallowReactive: typeof import('vue')['shallowReactive']
  const shallowReadonly: typeof import('vue')['shallowReadonly']
  const shallowRef: typeof import('vue')['shallowRef']
  const t: typeof import('./composables/i18n')['t']
  const toRaw: typeof import('vue')['toRaw']
  const toRef: typeof import('vue')['toRef']
  const toRefs: typeof import('vue')['toRefs']
  const toValue: typeof import('vue')['toValue']
  const toggleDark: typeof import('./composables/dark')['toggleDark']
  const toggleLocales: typeof import('./composables/locales')['toggleLocales']
  const triggerRef: typeof import('vue')['triggerRef']
  const unref: typeof import('vue')['unref']
  const useAttrs: typeof import('vue')['useAttrs']
  const useAuthStore: typeof import('./stores/auth')['useAuthStore']
  const useCssModule: typeof import('vue')['useCssModule']
  const useCssVars: typeof import('vue')['useCssVars']
  const useFetch: typeof import('./composables/fetch')['useFetch']
  const useGuard: typeof import('./composables/guard')['useGuard']
  const useHead: typeof import('@vueuse/head')['useHead']
  const useI18n: typeof import('./composables/i18n')['useI18n']
  const useLogger: typeof import('./composables/logger')['useLogger']
  const useNextAuth: typeof import('./composables/auth')['useNextAuth']
  const usePageContext: typeof import('./composables/pageContext')['usePageContext']
  const usePageTitle: typeof import('./composables/pageTitle')['usePageTitle']
  const useSeoMeta: typeof import('@vueuse/head')['useSeoMeta']
  const useSlots: typeof import('vue')['useSlots']
  const useSsrLogger: typeof import('./composables/logger')['useSsrLogger']
  const useUiStore: typeof import('./stores/ui')['useUiStore']
  const watch: typeof import('vue')['watch']
  const watchEffect: typeof import('vue')['watchEffect']
  const watchPostEffect: typeof import('vue')['watchPostEffect']
  const watchSyncEffect: typeof import('vue')['watchSyncEffect']
}
// for type re-export
declare global {
  // @ts-ignore
  export type { Component, ComponentPublicInstance, ComputedRef, ExtractDefaultPropTypes, ExtractPropTypes, ExtractPublicPropTypes, InjectionKey, PropType, Ref, VNode, WritableComputedRef } from 'vue'
  import('vue')
}
// for vue template auto import
import { UnwrapRef } from 'vue'
declare module 'vue' {
  interface ComponentCustomProperties {
    readonly $$: UnwrapRef<typeof import('vue/macros')['$$']>
    readonly $: UnwrapRef<typeof import('vue/macros')['$']>
    readonly $computed: UnwrapRef<typeof import('vue/macros')['$computed']>
    readonly $customRef: UnwrapRef<typeof import('vue/macros')['$customRef']>
    readonly $ref: UnwrapRef<typeof import('vue/macros')['$ref']>
    readonly $shallowRef: UnwrapRef<typeof import('vue/macros')['$shallowRef']>
    readonly $toRef: UnwrapRef<typeof import('vue/macros')['$toRef']>
    readonly COOKIES_SESSION_TOKEN: UnwrapRef<typeof import('./composables/auth')['COOKIES_SESSION_TOKEN']>
    readonly COOKIES_USER_TOKEN: UnwrapRef<typeof import('./composables/auth')['COOKIES_USER_TOKEN']>
    readonly EffectScope: UnwrapRef<typeof import('vue')['EffectScope']>
    readonly FetchError: UnwrapRef<typeof import('./composables/fetch')['FetchError']>
    readonly Locale: UnwrapRef<typeof import('./composables/locales')['Locale']>
    readonly RequestConfig: UnwrapRef<typeof import('./composables/fetch')['RequestConfig']>
    readonly SESSION_TOKEN_EXPIRY: UnwrapRef<typeof import('./composables/auth')['SESSION_TOKEN_EXPIRY']>
    readonly USE_FETCH_REQ_INIT: UnwrapRef<typeof import('./composables/fetch')['USE_FETCH_REQ_INIT']>
    readonly UseFetchResult: UnwrapRef<typeof import('./composables/fetch')['UseFetchResult']>
    readonly computed: UnwrapRef<typeof import('vue')['computed']>
    readonly cookieOptions: UnwrapRef<typeof import('./composables/auth')['cookieOptions']>
    readonly createApp: UnwrapRef<typeof import('vue')['createApp']>
    readonly customRef: UnwrapRef<typeof import('vue')['customRef']>
    readonly defineAsyncComponent: UnwrapRef<typeof import('vue')['defineAsyncComponent']>
    readonly defineComponent: UnwrapRef<typeof import('vue')['defineComponent']>
    readonly effectScope: UnwrapRef<typeof import('vue')['effectScope']>
    readonly getCurrentInstance: UnwrapRef<typeof import('vue')['getCurrentInstance']>
    readonly getCurrentScope: UnwrapRef<typeof import('vue')['getCurrentScope']>
    readonly getI18n: UnwrapRef<typeof import('./composables/i18n')['getI18n']>
    readonly getLocale: UnwrapRef<typeof import('./composables/locales')['getLocale']>
    readonly h: UnwrapRef<typeof import('vue')['h']>
    readonly inject: UnwrapRef<typeof import('vue')['inject']>
    readonly isClient: UnwrapRef<typeof import('./composables/auth')['isClient']>
    readonly isDark: UnwrapRef<typeof import('./composables/dark')['isDark']>
    readonly isProxy: UnwrapRef<typeof import('vue')['isProxy']>
    readonly isReactive: UnwrapRef<typeof import('vue')['isReactive']>
    readonly isReadonly: UnwrapRef<typeof import('vue')['isReadonly']>
    readonly isRef: UnwrapRef<typeof import('vue')['isRef']>
    readonly markRaw: UnwrapRef<typeof import('vue')['markRaw']>
    readonly nextTick: UnwrapRef<typeof import('vue')['nextTick']>
    readonly onActivated: UnwrapRef<typeof import('vue')['onActivated']>
    readonly onBeforeMount: UnwrapRef<typeof import('vue')['onBeforeMount']>
    readonly onBeforeUnmount: UnwrapRef<typeof import('vue')['onBeforeUnmount']>
    readonly onBeforeUpdate: UnwrapRef<typeof import('vue')['onBeforeUpdate']>
    readonly onDeactivated: UnwrapRef<typeof import('vue')['onDeactivated']>
    readonly onErrorCaptured: UnwrapRef<typeof import('vue')['onErrorCaptured']>
    readonly onMounted: UnwrapRef<typeof import('vue')['onMounted']>
    readonly onRenderTracked: UnwrapRef<typeof import('vue')['onRenderTracked']>
    readonly onRenderTriggered: UnwrapRef<typeof import('vue')['onRenderTriggered']>
    readonly onScopeDispose: UnwrapRef<typeof import('vue')['onScopeDispose']>
    readonly onServerPrefetch: UnwrapRef<typeof import('vue')['onServerPrefetch']>
    readonly onUnmounted: UnwrapRef<typeof import('vue')['onUnmounted']>
    readonly onUpdated: UnwrapRef<typeof import('vue')['onUpdated']>
    readonly pageContext: UnwrapRef<typeof import('./composables/index')['pageContext']>
    readonly preferredDark: UnwrapRef<typeof import('./composables/dark')['preferredDark']>
    readonly provide: UnwrapRef<typeof import('vue')['provide']>
    readonly provideAuth: UnwrapRef<typeof import('./composables/auth')['provideAuth']>
    readonly reactive: UnwrapRef<typeof import('vue')['reactive']>
    readonly readonly: UnwrapRef<typeof import('vue')['readonly']>
    readonly ref: UnwrapRef<typeof import('vue')['ref']>
    readonly resolveComponent: UnwrapRef<typeof import('vue')['resolveComponent']>
    readonly setPageContext: UnwrapRef<typeof import('./composables/pageContext')['setPageContext']>
    readonly shallowReactive: UnwrapRef<typeof import('vue')['shallowReactive']>
    readonly shallowReadonly: UnwrapRef<typeof import('vue')['shallowReadonly']>
    readonly shallowRef: UnwrapRef<typeof import('vue')['shallowRef']>
    readonly t: UnwrapRef<typeof import('./composables/i18n')['t']>
    readonly toRaw: UnwrapRef<typeof import('vue')['toRaw']>
    readonly toRef: UnwrapRef<typeof import('vue')['toRef']>
    readonly toRefs: UnwrapRef<typeof import('vue')['toRefs']>
    readonly toValue: UnwrapRef<typeof import('vue')['toValue']>
    readonly toggleDark: UnwrapRef<typeof import('./composables/dark')['toggleDark']>
    readonly toggleLocales: UnwrapRef<typeof import('./composables/locales')['toggleLocales']>
    readonly triggerRef: UnwrapRef<typeof import('vue')['triggerRef']>
    readonly unref: UnwrapRef<typeof import('vue')['unref']>
    readonly useAttrs: UnwrapRef<typeof import('vue')['useAttrs']>
    readonly useAuthStore: UnwrapRef<typeof import('./stores/auth')['useAuthStore']>
    readonly useCssModule: UnwrapRef<typeof import('vue')['useCssModule']>
    readonly useCssVars: UnwrapRef<typeof import('vue')['useCssVars']>
    readonly useFetch: UnwrapRef<typeof import('./composables/fetch')['useFetch']>
    readonly useGuard: UnwrapRef<typeof import('./composables/guard')['useGuard']>
    readonly useHead: UnwrapRef<typeof import('@vueuse/head')['useHead']>
    readonly useI18n: UnwrapRef<typeof import('./composables/i18n')['useI18n']>
    readonly useLogger: UnwrapRef<typeof import('./composables/logger')['useLogger']>
    readonly useNextAuth: UnwrapRef<typeof import('./composables/auth')['useNextAuth']>
    readonly usePageContext: UnwrapRef<typeof import('./composables/pageContext')['usePageContext']>
    readonly usePageTitle: UnwrapRef<typeof import('./composables/pageTitle')['usePageTitle']>
    readonly useSeoMeta: UnwrapRef<typeof import('@vueuse/head')['useSeoMeta']>
    readonly useSlots: UnwrapRef<typeof import('vue')['useSlots']>
    readonly useSsrLogger: UnwrapRef<typeof import('./composables/logger')['useSsrLogger']>
    readonly useUiStore: UnwrapRef<typeof import('./stores/ui')['useUiStore']>
    readonly watch: UnwrapRef<typeof import('vue')['watch']>
    readonly watchEffect: UnwrapRef<typeof import('vue')['watchEffect']>
    readonly watchPostEffect: UnwrapRef<typeof import('vue')['watchPostEffect']>
    readonly watchSyncEffect: UnwrapRef<typeof import('vue')['watchSyncEffect']>
  }
}
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    readonly $$: UnwrapRef<typeof import('vue/macros')['$$']>
    readonly $: UnwrapRef<typeof import('vue/macros')['$']>
    readonly $computed: UnwrapRef<typeof import('vue/macros')['$computed']>
    readonly $customRef: UnwrapRef<typeof import('vue/macros')['$customRef']>
    readonly $ref: UnwrapRef<typeof import('vue/macros')['$ref']>
    readonly $shallowRef: UnwrapRef<typeof import('vue/macros')['$shallowRef']>
    readonly $toRef: UnwrapRef<typeof import('vue/macros')['$toRef']>
    readonly COOKIES_SESSION_TOKEN: UnwrapRef<typeof import('./composables/auth')['COOKIES_SESSION_TOKEN']>
    readonly COOKIES_USER_TOKEN: UnwrapRef<typeof import('./composables/auth')['COOKIES_USER_TOKEN']>
    readonly EffectScope: UnwrapRef<typeof import('vue')['EffectScope']>
    readonly FetchError: UnwrapRef<typeof import('./composables/fetch')['FetchError']>
    readonly Locale: UnwrapRef<typeof import('./composables/locales')['Locale']>
    readonly RequestConfig: UnwrapRef<typeof import('./composables/fetch')['RequestConfig']>
    readonly SESSION_TOKEN_EXPIRY: UnwrapRef<typeof import('./composables/auth')['SESSION_TOKEN_EXPIRY']>
    readonly USE_FETCH_REQ_INIT: UnwrapRef<typeof import('./composables/fetch')['USE_FETCH_REQ_INIT']>
    readonly UseFetchResult: UnwrapRef<typeof import('./composables/fetch')['UseFetchResult']>
    readonly computed: UnwrapRef<typeof import('vue')['computed']>
    readonly cookieOptions: UnwrapRef<typeof import('./composables/auth')['cookieOptions']>
    readonly createApp: UnwrapRef<typeof import('vue')['createApp']>
    readonly customRef: UnwrapRef<typeof import('vue')['customRef']>
    readonly defineAsyncComponent: UnwrapRef<typeof import('vue')['defineAsyncComponent']>
    readonly defineComponent: UnwrapRef<typeof import('vue')['defineComponent']>
    readonly effectScope: UnwrapRef<typeof import('vue')['effectScope']>
    readonly getCurrentInstance: UnwrapRef<typeof import('vue')['getCurrentInstance']>
    readonly getCurrentScope: UnwrapRef<typeof import('vue')['getCurrentScope']>
    readonly getI18n: UnwrapRef<typeof import('./composables/i18n')['getI18n']>
    readonly getLocale: UnwrapRef<typeof import('./composables/locales')['getLocale']>
    readonly h: UnwrapRef<typeof import('vue')['h']>
    readonly inject: UnwrapRef<typeof import('vue')['inject']>
    readonly isClient: UnwrapRef<typeof import('./composables/auth')['isClient']>
    readonly isDark: UnwrapRef<typeof import('./composables/dark')['isDark']>
    readonly isProxy: UnwrapRef<typeof import('vue')['isProxy']>
    readonly isReactive: UnwrapRef<typeof import('vue')['isReactive']>
    readonly isReadonly: UnwrapRef<typeof import('vue')['isReadonly']>
    readonly isRef: UnwrapRef<typeof import('vue')['isRef']>
    readonly markRaw: UnwrapRef<typeof import('vue')['markRaw']>
    readonly nextTick: UnwrapRef<typeof import('vue')['nextTick']>
    readonly onActivated: UnwrapRef<typeof import('vue')['onActivated']>
    readonly onBeforeMount: UnwrapRef<typeof import('vue')['onBeforeMount']>
    readonly onBeforeUnmount: UnwrapRef<typeof import('vue')['onBeforeUnmount']>
    readonly onBeforeUpdate: UnwrapRef<typeof import('vue')['onBeforeUpdate']>
    readonly onDeactivated: UnwrapRef<typeof import('vue')['onDeactivated']>
    readonly onErrorCaptured: UnwrapRef<typeof import('vue')['onErrorCaptured']>
    readonly onMounted: UnwrapRef<typeof import('vue')['onMounted']>
    readonly onRenderTracked: UnwrapRef<typeof import('vue')['onRenderTracked']>
    readonly onRenderTriggered: UnwrapRef<typeof import('vue')['onRenderTriggered']>
    readonly onScopeDispose: UnwrapRef<typeof import('vue')['onScopeDispose']>
    readonly onServerPrefetch: UnwrapRef<typeof import('vue')['onServerPrefetch']>
    readonly onUnmounted: UnwrapRef<typeof import('vue')['onUnmounted']>
    readonly onUpdated: UnwrapRef<typeof import('vue')['onUpdated']>
    readonly pageContext: UnwrapRef<typeof import('./composables/index')['pageContext']>
    readonly preferredDark: UnwrapRef<typeof import('./composables/dark')['preferredDark']>
    readonly provide: UnwrapRef<typeof import('vue')['provide']>
    readonly provideAuth: UnwrapRef<typeof import('./composables/auth')['provideAuth']>
    readonly reactive: UnwrapRef<typeof import('vue')['reactive']>
    readonly readonly: UnwrapRef<typeof import('vue')['readonly']>
    readonly ref: UnwrapRef<typeof import('vue')['ref']>
    readonly resolveComponent: UnwrapRef<typeof import('vue')['resolveComponent']>
    readonly setPageContext: UnwrapRef<typeof import('./composables/pageContext')['setPageContext']>
    readonly shallowReactive: UnwrapRef<typeof import('vue')['shallowReactive']>
    readonly shallowReadonly: UnwrapRef<typeof import('vue')['shallowReadonly']>
    readonly shallowRef: UnwrapRef<typeof import('vue')['shallowRef']>
    readonly t: UnwrapRef<typeof import('./composables/i18n')['t']>
    readonly toRaw: UnwrapRef<typeof import('vue')['toRaw']>
    readonly toRef: UnwrapRef<typeof import('vue')['toRef']>
    readonly toRefs: UnwrapRef<typeof import('vue')['toRefs']>
    readonly toValue: UnwrapRef<typeof import('vue')['toValue']>
    readonly toggleDark: UnwrapRef<typeof import('./composables/dark')['toggleDark']>
    readonly toggleLocales: UnwrapRef<typeof import('./composables/locales')['toggleLocales']>
    readonly triggerRef: UnwrapRef<typeof import('vue')['triggerRef']>
    readonly unref: UnwrapRef<typeof import('vue')['unref']>
    readonly useAttrs: UnwrapRef<typeof import('vue')['useAttrs']>
    readonly useAuthStore: UnwrapRef<typeof import('./stores/auth')['useAuthStore']>
    readonly useCssModule: UnwrapRef<typeof import('vue')['useCssModule']>
    readonly useCssVars: UnwrapRef<typeof import('vue')['useCssVars']>
    readonly useFetch: UnwrapRef<typeof import('./composables/fetch')['useFetch']>
    readonly useGuard: UnwrapRef<typeof import('./composables/guard')['useGuard']>
    readonly useHead: UnwrapRef<typeof import('@vueuse/head')['useHead']>
    readonly useI18n: UnwrapRef<typeof import('./composables/i18n')['useI18n']>
    readonly useLogger: UnwrapRef<typeof import('./composables/logger')['useLogger']>
    readonly useNextAuth: UnwrapRef<typeof import('./composables/auth')['useNextAuth']>
    readonly usePageContext: UnwrapRef<typeof import('./composables/pageContext')['usePageContext']>
    readonly usePageTitle: UnwrapRef<typeof import('./composables/pageTitle')['usePageTitle']>
    readonly useSeoMeta: UnwrapRef<typeof import('@vueuse/head')['useSeoMeta']>
    readonly useSlots: UnwrapRef<typeof import('vue')['useSlots']>
    readonly useSsrLogger: UnwrapRef<typeof import('./composables/logger')['useSsrLogger']>
    readonly useUiStore: UnwrapRef<typeof import('./stores/ui')['useUiStore']>
    readonly watch: UnwrapRef<typeof import('vue')['watch']>
    readonly watchEffect: UnwrapRef<typeof import('vue')['watchEffect']>
    readonly watchPostEffect: UnwrapRef<typeof import('vue')['watchPostEffect']>
    readonly watchSyncEffect: UnwrapRef<typeof import('vue')['watchSyncEffect']>
  }
}
