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
  const AUTHJS_COOKIES_AUTHJS_SESSION_TOKEN: typeof import('./composables/auth-authjs')['AUTHJS_COOKIES_AUTHJS_SESSION_TOKEN']
  const AUTHJS_COOKIES_USER_TOKEN: typeof import('./composables/auth-authjs')['AUTHJS_COOKIES_USER_TOKEN']
  const AUTHJS_SESSION_TOKEN_EXPIRY: typeof import('./composables/auth-authjs')['AUTHJS_SESSION_TOKEN_EXPIRY']
  const ApiError: typeof import('./core/ApiError')['ApiError']
  const AuthService: typeof import('./services/AuthService')['AuthService']
  const COOKIES_SESSION_TOKEN: (typeof import('./composables/auth-authjs'))['COOKIES_SESSION_TOKEN']
  const COOKIES_USER_TOKEN: (typeof import('./composables/auth-authjs'))['COOKIES_USER_TOKEN']
  const CancelError: typeof import('./core/CancelablePromise')['CancelError']
  const CancelablePromise: typeof import('./core/CancelablePromise')['CancelablePromise']
  const DefaultService: typeof import('./services/DefaultService')['DefaultService']
  const EffectScope: typeof import('vue')['EffectScope']
  const FetchError: typeof import('./composables/fetch')['FetchError']
  const HealthService: typeof import('./services/HealthService')['HealthService']
  const InitialStateSymbol: typeof import('./modules/pinia')['InitialStateSymbol']
  const LUCIAAUTH_COOKIES_SESSION_TOKEN: typeof import('./composables/auth-lucia')['LUCIAAUTH_COOKIES_SESSION_TOKEN']
  const LUCIAAUTH_COOKIES_USER_TOKEN: (typeof import('./composables/auth-lucia'))['LUCIAAUTH_COOKIES_USER_TOKEN']
  const LUCIAAUTH_SESSION_TOKEN_EXPIRY: typeof import('./composables/auth-lucia')['LUCIAAUTH_SESSION_TOKEN_EXPIRY']
  const Locale: typeof import('./composables/locales')['Locale']
  const LoggerSymbol: typeof import('./modules/logger')['LoggerSymbol']
  const MiscService: typeof import('./services/MiscService')['MiscService']
  const OpenAPI: typeof import('./core/OpenAPI')['OpenAPI']
  const RequestConfig: typeof import('./composables/fetch')['RequestConfig']
  const SESSION_TOKEN_EXPIRY: (typeof import('./composables/auth-authjs'))['SESSION_TOKEN_EXPIRY']
  const TasksService: typeof import('./services/TasksService')['TasksService']
  const USE_FETCH_REQ_INIT: typeof import('./composables/fetch')['USE_FETCH_REQ_INIT']
  const UseFetchResult: typeof import('./composables/fetch')['UseFetchResult']
  const UserService: typeof import('./services/UserService')['UserService']
  const VUE_QUERY_STATE: typeof import('./modules/vue-query')['VUE_QUERY_STATE']
  const X_CORRELATION_ID: typeof import('./composables/logger')['X_CORRELATION_ID']
  const base64: typeof import('./core/request')['base64']
  const catchErrorCodes: typeof import('./core/request')['catchErrorCodes']
  const computed: typeof import('vue')['computed']
  const cookieOptions: (typeof import('./composables/auth-lucia'))['cookieOptions']
  const createApp: typeof import('vue')['createApp']
  const customRef: typeof import('vue')['customRef']
  const defineAsyncComponent: typeof import('vue')['defineAsyncComponent']
  const defineComponent: typeof import('vue')['defineComponent']
  const effectScope: typeof import('vue')['effectScope']
  const getCookie: typeof import('./composables/fetch')['getCookie']
  const getCurrentInstance: typeof import('vue')['getCurrentInstance']
  const getCurrentScope: typeof import('vue')['getCurrentScope']
  const getFormData: typeof import('./core/request')['getFormData']
  const getHeaders: typeof import('./core/request')['getHeaders']
  const getI18n: typeof import('./composables/i18n')['getI18n']
  const getLocale: typeof import('./composables/locales')['getLocale']
  const getLogsterForm: typeof import('./composables/form')['getLogsterForm']
  const getQueryString: typeof import('./core/request')['getQueryString']
  const getRequestBody: typeof import('./core/request')['getRequestBody']
  const getResponseBody: typeof import('./core/request')['getResponseBody']
  const getResponseHeader: typeof import('./core/request')['getResponseHeader']
  const h: typeof import('vue')['h']
  const initFlashMessage: typeof import('./modules/flash-message')['initFlashMessage']
  const initialPage: typeof import('./modules/vue-query')['initialPage']
  const inject: typeof import('vue')['inject']
  const install: (typeof import('./modules/pinia'))['install']
  const installPinia: typeof import('./modules/pinia')['installPinia']
  const isBlob: typeof import('./core/request')['isBlob']
  const isClient: (typeof import('./composables/auth-lucia'))['isClient']
  const isDark: typeof import('./composables/dark')['isDark']
  const isDefined: typeof import('./core/request')['isDefined']
  const isFormData: typeof import('./core/request')['isFormData']
  const isProxy: typeof import('vue')['isProxy']
  const isReactive: typeof import('vue')['isReactive']
  const isReadonly: typeof import('vue')['isReadonly']
  const isRef: typeof import('vue')['isRef']
  const isString: typeof import('./core/request')['isString']
  const isStringWithValue: typeof import('./core/request')['isStringWithValue']
  const markRaw: typeof import('vue')['markRaw']
  const nextTick: typeof import('vue')['nextTick']
  const onActivated: typeof import('vue')['onActivated']
  const onBeforeMount: typeof import('vue')['onBeforeMount']
  const onBeforeUnmount: typeof import('vue')['onBeforeUnmount']
  const onBeforeUpdate: typeof import('vue')['onBeforeUpdate']
  const onDeactivated: typeof import('vue')['onDeactivated']
  const onErrorCaptured: typeof import('vue')['onErrorCaptured']
  const onErrorClient: typeof import('./modules/error-client')['onErrorClient']
  const onErrorFlash: typeof import('./modules/flash-message')['onErrorFlash']
  const onFlash: typeof import('./modules/flash-message')['onFlash']
  const onInfoFlash: typeof import('./modules/flash-message')['onInfoFlash']
  const onMounted: typeof import('vue')['onMounted']
  const onRenderTracked: typeof import('vue')['onRenderTracked']
  const onRenderTriggered: typeof import('vue')['onRenderTriggered']
  const onScopeDispose: typeof import('vue')['onScopeDispose']
  const onServerPrefetch: typeof import('vue')['onServerPrefetch']
  const onUnmounted: typeof import('vue')['onUnmounted']
  const onUpdated: typeof import('vue')['onUpdated']
  const pageContext: (typeof import('./composables/index'))['pageContext']
  const preferredDark: typeof import('./composables/dark')['preferredDark']
  const provide: typeof import('vue')['provide']
  const provideAuth: (typeof import('./composables/auth-lucia'))['provideAuth']
  const provideFlashMessage: typeof import('./modules/flash-message')['provideFlashMessage']
  const provideLogger: typeof import('./modules/logger')['provideLogger']
  const provideLuciaAuth: typeof import('./composables/auth-lucia')['provideLuciaAuth']
  const provideNextAuth: typeof import('./composables/auth-authjs')['provideNextAuth']
  const providePageContext: typeof import('./composables/pageContext')['providePageContext']
  const provideVueQuery: typeof import('./modules/vue-query')['provideVueQuery']
  const reactive: typeof import('vue')['reactive']
  const readonly: typeof import('vue')['readonly']
  const ref: typeof import('vue')['ref']
  const request: typeof import('./core/request')['request']
  const resolve: typeof import('./core/request')['resolve']
  const resolveComponent: typeof import('vue')['resolveComponent']
  const sendRequest: typeof import('./core/request')['sendRequest']
  const setPageContext: (typeof import('./composables/pageContext'))['setPageContext']
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
  const useAuthStore: typeof import('./stores/auth-store')['useAuthStore']
  const useBaseUrl: typeof import('./composables/baseUrl')['useBaseUrl']
  const useCssModule: typeof import('vue')['useCssModule']
  const useCssVars: typeof import('vue')['useCssVars']
  const useFetch: typeof import('./composables/fetch')['useFetch']
  const useFetchCopy: typeof import('./composables/fetch copy')['useFetchCopy']
  const useFlashMessage: typeof import('./modules/flash-message')['useFlashMessage']
  const useGuard: typeof import('./composables/guard')['useGuard']
  const useHead: typeof import('@vueuse/head')['useHead']
  const useI18n: typeof import('./composables/i18n')['useI18n']
  const useLogger: typeof import('./composables/logger')['useLogger']
  const useLuciaAuth: typeof import('./composables/auth-lucia')['useLuciaAuth']
  const useNextAuth: typeof import('./composables/auth-authjs')['useNextAuth']
  const usePageContext: typeof import('./composables/pageContext')['usePageContext']
  const usePageTitle: typeof import('./composables/pageTitle')['usePageTitle']
  const useSeoMeta: typeof import('@vueuse/head')['useSeoMeta']
  const useService: typeof import('./composables/service')['useService']
  const useServiceQuery: typeof import('./composables/service')['useServiceQuery']
  const useSession: typeof import('./composables/session')['useSession']
  const useSlots: typeof import('vue')['useSlots']
  const useSsrLogger: typeof import('./composables/logger')['useSsrLogger']
  const useUiStore: typeof import('./stores/ui')['useUiStore']
  const useValidation: typeof import('./composables/validation')['useValidation']
  const userType: typeof import('./models/User')['userType']
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
    readonly // LUCIAAUTH_COOKIES_USER_TOKEN: UnwrapRef<typeof import('./composables/auth-lucia')['// LUCIAAUTH_COOKIES_USER_TOKEN']>
    readonly AUTHJS_COOKIES_AUTHJS_SESSION_TOKEN: UnwrapRef<typeof import('./composables/auth-authjs')['AUTHJS_COOKIES_AUTHJS_SESSION_TOKEN']>
    readonly AUTHJS_COOKIES_USER_TOKEN: UnwrapRef<typeof import('./composables/auth-authjs')['AUTHJS_COOKIES_USER_TOKEN']>
    readonly AUTHJS_SESSION_TOKEN_EXPIRY: UnwrapRef<typeof import('./composables/auth-authjs')['AUTHJS_SESSION_TOKEN_EXPIRY']>
    readonly ApiError: UnwrapRef<typeof import('./core/ApiError')['ApiError']>
    readonly AuthService: UnwrapRef<typeof import('./services/AuthService')['AuthService']>
    readonly CancelError: UnwrapRef<typeof import('./core/CancelablePromise')['CancelError']>
    readonly CancelablePromise: UnwrapRef<typeof import('./core/CancelablePromise')['CancelablePromise']>
    readonly EffectScope: UnwrapRef<typeof import('vue')['EffectScope']>
    readonly FetchError: UnwrapRef<typeof import('./composables/fetch')['FetchError']>
    readonly HealthService: UnwrapRef<typeof import('./services/HealthService')['HealthService']>
    readonly InitialStateSymbol: UnwrapRef<typeof import('./modules/pinia')['InitialStateSymbol']>
    readonly LUCIAAUTH_COOKIES_SESSION_TOKEN: UnwrapRef<typeof import('./composables/auth-lucia')['LUCIAAUTH_COOKIES_SESSION_TOKEN']>
    readonly LUCIAAUTH_SESSION_TOKEN_EXPIRY: UnwrapRef<typeof import('./composables/auth-lucia')['LUCIAAUTH_SESSION_TOKEN_EXPIRY']>
    readonly Locale: UnwrapRef<typeof import('./composables/locales')['Locale']>
    readonly LoggerSymbol: UnwrapRef<typeof import('./modules/logger')['LoggerSymbol']>
    readonly MiscService: UnwrapRef<typeof import('./services/MiscService')['MiscService']>
    readonly OpenAPI: UnwrapRef<typeof import('./core/OpenAPI')['OpenAPI']>
    readonly TasksService: UnwrapRef<typeof import('./services/TasksService')['TasksService']>
    readonly USE_FETCH_REQ_INIT: UnwrapRef<typeof import('./composables/fetch')['USE_FETCH_REQ_INIT']>
    readonly UseFetchResult: UnwrapRef<typeof import('./composables/fetch')['UseFetchResult']>
    readonly UserService: UnwrapRef<typeof import('./services/UserService')['UserService']>
    readonly VUE_QUERY_STATE: UnwrapRef<typeof import('./modules/vue-query')['VUE_QUERY_STATE']>
    readonly X_CORRELATION_ID: UnwrapRef<typeof import('./composables/logger')['X_CORRELATION_ID']>
    readonly base64: UnwrapRef<typeof import('./core/request')['base64']>
    readonly catchErrorCodes: UnwrapRef<typeof import('./core/request')['catchErrorCodes']>
    readonly computed: UnwrapRef<typeof import('vue')['computed']>
    readonly createApp: UnwrapRef<typeof import('vue')['createApp']>
    readonly customRef: UnwrapRef<typeof import('vue')['customRef']>
    readonly defineAsyncComponent: UnwrapRef<typeof import('vue')['defineAsyncComponent']>
    readonly defineComponent: UnwrapRef<typeof import('vue')['defineComponent']>
    readonly effectScope: UnwrapRef<typeof import('vue')['effectScope']>
    readonly getCookie: UnwrapRef<typeof import('./composables/fetch')['getCookie']>
    readonly getCurrentInstance: UnwrapRef<typeof import('vue')['getCurrentInstance']>
    readonly getCurrentScope: UnwrapRef<typeof import('vue')['getCurrentScope']>
    readonly getFormData: UnwrapRef<typeof import('./core/request')['getFormData']>
    readonly getHeaders: UnwrapRef<typeof import('./core/request')['getHeaders']>
    readonly getI18n: UnwrapRef<typeof import('./composables/i18n')['getI18n']>
    readonly getLocale: UnwrapRef<typeof import('./composables/locales')['getLocale']>
    readonly getLogsterForm: UnwrapRef<typeof import('./composables/form')['getLogsterForm']>
    readonly getQueryString: UnwrapRef<typeof import('./core/request')['getQueryString']>
    readonly getRequestBody: UnwrapRef<typeof import('./core/request')['getRequestBody']>
    readonly getResponseBody: UnwrapRef<typeof import('./core/request')['getResponseBody']>
    readonly getResponseHeader: UnwrapRef<typeof import('./core/request')['getResponseHeader']>
    readonly h: UnwrapRef<typeof import('vue')['h']>
    readonly initFlashMessage: UnwrapRef<typeof import('./modules/flash-message')['initFlashMessage']>
    readonly initialPage: UnwrapRef<typeof import('./modules/vue-query')['initialPage']>
    readonly inject: UnwrapRef<typeof import('vue')['inject']>
    readonly installPinia: UnwrapRef<typeof import('./modules/pinia')['installPinia']>
    readonly isBlob: UnwrapRef<typeof import('./core/request')['isBlob']>
    readonly isDark: UnwrapRef<typeof import('./composables/dark')['isDark']>
    readonly isDefined: UnwrapRef<typeof import('./core/request')['isDefined']>
    readonly isFormData: UnwrapRef<typeof import('./core/request')['isFormData']>
    readonly isProxy: UnwrapRef<typeof import('vue')['isProxy']>
    readonly isReactive: UnwrapRef<typeof import('vue')['isReactive']>
    readonly isReadonly: UnwrapRef<typeof import('vue')['isReadonly']>
    readonly isRef: UnwrapRef<typeof import('vue')['isRef']>
    readonly isString: UnwrapRef<typeof import('./core/request')['isString']>
    readonly isStringWithValue: UnwrapRef<typeof import('./core/request')['isStringWithValue']>
    readonly markRaw: UnwrapRef<typeof import('vue')['markRaw']>
    readonly nextTick: UnwrapRef<typeof import('vue')['nextTick']>
    readonly onActivated: UnwrapRef<typeof import('vue')['onActivated']>
    readonly onBeforeMount: UnwrapRef<typeof import('vue')['onBeforeMount']>
    readonly onBeforeUnmount: UnwrapRef<typeof import('vue')['onBeforeUnmount']>
    readonly onBeforeUpdate: UnwrapRef<typeof import('vue')['onBeforeUpdate']>
    readonly onDeactivated: UnwrapRef<typeof import('vue')['onDeactivated']>
    readonly onErrorCaptured: UnwrapRef<typeof import('vue')['onErrorCaptured']>
    readonly onErrorClient: UnwrapRef<typeof import('./modules/error-client')['onErrorClient']>
    readonly onErrorFlash: UnwrapRef<typeof import('./modules/flash-message')['onErrorFlash']>
    readonly onFlash: UnwrapRef<typeof import('./modules/flash-message')['onFlash']>
    readonly onMounted: UnwrapRef<typeof import('vue')['onMounted']>
    readonly onRenderTracked: UnwrapRef<typeof import('vue')['onRenderTracked']>
    readonly onRenderTriggered: UnwrapRef<typeof import('vue')['onRenderTriggered']>
    readonly onScopeDispose: UnwrapRef<typeof import('vue')['onScopeDispose']>
    readonly onServerPrefetch: UnwrapRef<typeof import('vue')['onServerPrefetch']>
    readonly onUnmounted: UnwrapRef<typeof import('vue')['onUnmounted']>
    readonly onUpdated: UnwrapRef<typeof import('vue')['onUpdated']>
    readonly preferredDark: UnwrapRef<typeof import('./composables/dark')['preferredDark']>
    readonly provide: UnwrapRef<typeof import('vue')['provide']>
    readonly provideFlashMessage: UnwrapRef<typeof import('./modules/flash-message')['provideFlashMessage']>
    readonly provideLogger: UnwrapRef<typeof import('./modules/logger')['provideLogger']>
    readonly provideLuciaAuth: UnwrapRef<typeof import('./composables/auth-lucia')['provideLuciaAuth']>
    readonly provideNextAuth: UnwrapRef<typeof import('./composables/auth-authjs')['provideNextAuth']>
    readonly providePageContext: UnwrapRef<typeof import('./composables/pageContext')['providePageContext']>
    readonly provideVueQuery: UnwrapRef<typeof import('./modules/vue-query')['provideVueQuery']>
    readonly reactive: UnwrapRef<typeof import('vue')['reactive']>
    readonly readonly: UnwrapRef<typeof import('vue')['readonly']>
    readonly ref: UnwrapRef<typeof import('vue')['ref']>
    readonly request: UnwrapRef<typeof import('./core/request')['request']>
    readonly resolve: UnwrapRef<typeof import('./core/request')['resolve']>
    readonly resolveComponent: UnwrapRef<typeof import('vue')['resolveComponent']>
    readonly sendRequest: UnwrapRef<typeof import('./core/request')['sendRequest']>
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
    readonly useAuthStore: UnwrapRef<typeof import('./stores/auth-store')['useAuthStore']>
    readonly useBaseUrl: UnwrapRef<typeof import('./composables/baseUrl')['useBaseUrl']>
    readonly useCssModule: UnwrapRef<typeof import('vue')['useCssModule']>
    readonly useCssVars: UnwrapRef<typeof import('vue')['useCssVars']>
    readonly useFetch: UnwrapRef<typeof import('./composables/fetch')['useFetch']>
    readonly useFlashMessage: UnwrapRef<typeof import('./modules/flash-message')['useFlashMessage']>
    readonly useGuard: UnwrapRef<typeof import('./composables/guard')['useGuard']>
    readonly useHead: UnwrapRef<typeof import('@vueuse/head')['useHead']>
    readonly useI18n: UnwrapRef<typeof import('./composables/i18n')['useI18n']>
    readonly useLogger: UnwrapRef<typeof import('./composables/logger')['useLogger']>
    readonly useLuciaAuth: UnwrapRef<typeof import('./composables/auth-lucia')['useLuciaAuth']>
    readonly useNextAuth: UnwrapRef<typeof import('./composables/auth-authjs')['useNextAuth']>
    readonly usePageContext: UnwrapRef<typeof import('./composables/pageContext')['usePageContext']>
    readonly usePageTitle: UnwrapRef<typeof import('./composables/pageTitle')['usePageTitle']>
    readonly useSeoMeta: UnwrapRef<typeof import('@vueuse/head')['useSeoMeta']>
    readonly useService: UnwrapRef<typeof import('./composables/service')['useService']>
    readonly useServiceQuery: UnwrapRef<typeof import('./composables/service')['useServiceQuery']>
    readonly useSession: UnwrapRef<typeof import('./composables/session')['useSession']>
    readonly useSlots: UnwrapRef<typeof import('vue')['useSlots']>
    readonly useSsrLogger: UnwrapRef<typeof import('./composables/logger')['useSsrLogger']>
    readonly useUiStore: UnwrapRef<typeof import('./stores/ui')['useUiStore']>
    readonly useValidation: UnwrapRef<typeof import('./composables/validation')['useValidation']>
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
    readonly // LUCIAAUTH_COOKIES_USER_TOKEN: UnwrapRef<typeof import('./composables/auth-lucia')['// LUCIAAUTH_COOKIES_USER_TOKEN']>
    readonly AUTHJS_COOKIES_AUTHJS_SESSION_TOKEN: UnwrapRef<typeof import('./composables/auth-authjs')['AUTHJS_COOKIES_AUTHJS_SESSION_TOKEN']>
    readonly AUTHJS_COOKIES_USER_TOKEN: UnwrapRef<typeof import('./composables/auth-authjs')['AUTHJS_COOKIES_USER_TOKEN']>
    readonly AUTHJS_SESSION_TOKEN_EXPIRY: UnwrapRef<typeof import('./composables/auth-authjs')['AUTHJS_SESSION_TOKEN_EXPIRY']>
    readonly ApiError: UnwrapRef<typeof import('./core/ApiError')['ApiError']>
    readonly AuthService: UnwrapRef<typeof import('./services/AuthService')['AuthService']>
    readonly CancelError: UnwrapRef<typeof import('./core/CancelablePromise')['CancelError']>
    readonly CancelablePromise: UnwrapRef<typeof import('./core/CancelablePromise')['CancelablePromise']>
    readonly EffectScope: UnwrapRef<typeof import('vue')['EffectScope']>
    readonly FetchError: UnwrapRef<typeof import('./composables/fetch')['FetchError']>
    readonly HealthService: UnwrapRef<typeof import('./services/HealthService')['HealthService']>
    readonly InitialStateSymbol: UnwrapRef<typeof import('./modules/pinia')['InitialStateSymbol']>
    readonly LUCIAAUTH_COOKIES_SESSION_TOKEN: UnwrapRef<typeof import('./composables/auth-lucia')['LUCIAAUTH_COOKIES_SESSION_TOKEN']>
    readonly LUCIAAUTH_SESSION_TOKEN_EXPIRY: UnwrapRef<typeof import('./composables/auth-lucia')['LUCIAAUTH_SESSION_TOKEN_EXPIRY']>
    readonly Locale: UnwrapRef<typeof import('./composables/locales')['Locale']>
    readonly LoggerSymbol: UnwrapRef<typeof import('./modules/logger')['LoggerSymbol']>
    readonly MiscService: UnwrapRef<typeof import('./services/MiscService')['MiscService']>
    readonly OpenAPI: UnwrapRef<typeof import('./core/OpenAPI')['OpenAPI']>
    readonly TasksService: UnwrapRef<typeof import('./services/TasksService')['TasksService']>
    readonly USE_FETCH_REQ_INIT: UnwrapRef<typeof import('./composables/fetch')['USE_FETCH_REQ_INIT']>
    readonly UseFetchResult: UnwrapRef<typeof import('./composables/fetch')['UseFetchResult']>
    readonly UserService: UnwrapRef<typeof import('./services/UserService')['UserService']>
    readonly VUE_QUERY_STATE: UnwrapRef<typeof import('./modules/vue-query')['VUE_QUERY_STATE']>
    readonly X_CORRELATION_ID: UnwrapRef<typeof import('./composables/logger')['X_CORRELATION_ID']>
    readonly base64: UnwrapRef<typeof import('./core/request')['base64']>
    readonly catchErrorCodes: UnwrapRef<typeof import('./core/request')['catchErrorCodes']>
    readonly computed: UnwrapRef<typeof import('vue')['computed']>
    readonly createApp: UnwrapRef<typeof import('vue')['createApp']>
    readonly customRef: UnwrapRef<typeof import('vue')['customRef']>
    readonly defineAsyncComponent: UnwrapRef<typeof import('vue')['defineAsyncComponent']>
    readonly defineComponent: UnwrapRef<typeof import('vue')['defineComponent']>
    readonly effectScope: UnwrapRef<typeof import('vue')['effectScope']>
    readonly getCookie: UnwrapRef<typeof import('./composables/fetch')['getCookie']>
    readonly getCurrentInstance: UnwrapRef<typeof import('vue')['getCurrentInstance']>
    readonly getCurrentScope: UnwrapRef<typeof import('vue')['getCurrentScope']>
    readonly getFormData: UnwrapRef<typeof import('./core/request')['getFormData']>
    readonly getHeaders: UnwrapRef<typeof import('./core/request')['getHeaders']>
    readonly getI18n: UnwrapRef<typeof import('./composables/i18n')['getI18n']>
    readonly getLocale: UnwrapRef<typeof import('./composables/locales')['getLocale']>
    readonly getLogsterForm: UnwrapRef<typeof import('./composables/form')['getLogsterForm']>
    readonly getQueryString: UnwrapRef<typeof import('./core/request')['getQueryString']>
    readonly getRequestBody: UnwrapRef<typeof import('./core/request')['getRequestBody']>
    readonly getResponseBody: UnwrapRef<typeof import('./core/request')['getResponseBody']>
    readonly getResponseHeader: UnwrapRef<typeof import('./core/request')['getResponseHeader']>
    readonly h: UnwrapRef<typeof import('vue')['h']>
    readonly initFlashMessage: UnwrapRef<typeof import('./modules/flash-message')['initFlashMessage']>
    readonly initialPage: UnwrapRef<typeof import('./modules/vue-query')['initialPage']>
    readonly inject: UnwrapRef<typeof import('vue')['inject']>
    readonly installPinia: UnwrapRef<typeof import('./modules/pinia')['installPinia']>
    readonly isBlob: UnwrapRef<typeof import('./core/request')['isBlob']>
    readonly isDark: UnwrapRef<typeof import('./composables/dark')['isDark']>
    readonly isDefined: UnwrapRef<typeof import('./core/request')['isDefined']>
    readonly isFormData: UnwrapRef<typeof import('./core/request')['isFormData']>
    readonly isProxy: UnwrapRef<typeof import('vue')['isProxy']>
    readonly isReactive: UnwrapRef<typeof import('vue')['isReactive']>
    readonly isReadonly: UnwrapRef<typeof import('vue')['isReadonly']>
    readonly isRef: UnwrapRef<typeof import('vue')['isRef']>
    readonly isString: UnwrapRef<typeof import('./core/request')['isString']>
    readonly isStringWithValue: UnwrapRef<typeof import('./core/request')['isStringWithValue']>
    readonly markRaw: UnwrapRef<typeof import('vue')['markRaw']>
    readonly nextTick: UnwrapRef<typeof import('vue')['nextTick']>
    readonly onActivated: UnwrapRef<typeof import('vue')['onActivated']>
    readonly onBeforeMount: UnwrapRef<typeof import('vue')['onBeforeMount']>
    readonly onBeforeUnmount: UnwrapRef<typeof import('vue')['onBeforeUnmount']>
    readonly onBeforeUpdate: UnwrapRef<typeof import('vue')['onBeforeUpdate']>
    readonly onDeactivated: UnwrapRef<typeof import('vue')['onDeactivated']>
    readonly onErrorCaptured: UnwrapRef<typeof import('vue')['onErrorCaptured']>
    readonly onErrorClient: UnwrapRef<typeof import('./modules/error-client')['onErrorClient']>
    readonly onErrorFlash: UnwrapRef<typeof import('./modules/flash-message')['onErrorFlash']>
    readonly onFlash: UnwrapRef<typeof import('./modules/flash-message')['onFlash']>
    readonly onMounted: UnwrapRef<typeof import('vue')['onMounted']>
    readonly onRenderTracked: UnwrapRef<typeof import('vue')['onRenderTracked']>
    readonly onRenderTriggered: UnwrapRef<typeof import('vue')['onRenderTriggered']>
    readonly onScopeDispose: UnwrapRef<typeof import('vue')['onScopeDispose']>
    readonly onServerPrefetch: UnwrapRef<typeof import('vue')['onServerPrefetch']>
    readonly onUnmounted: UnwrapRef<typeof import('vue')['onUnmounted']>
    readonly onUpdated: UnwrapRef<typeof import('vue')['onUpdated']>
    readonly preferredDark: UnwrapRef<typeof import('./composables/dark')['preferredDark']>
    readonly provide: UnwrapRef<typeof import('vue')['provide']>
    readonly provideFlashMessage: UnwrapRef<typeof import('./modules/flash-message')['provideFlashMessage']>
    readonly provideLogger: UnwrapRef<typeof import('./modules/logger')['provideLogger']>
    readonly provideLuciaAuth: UnwrapRef<typeof import('./composables/auth-lucia')['provideLuciaAuth']>
    readonly provideNextAuth: UnwrapRef<typeof import('./composables/auth-authjs')['provideNextAuth']>
    readonly providePageContext: UnwrapRef<typeof import('./composables/pageContext')['providePageContext']>
    readonly provideVueQuery: UnwrapRef<typeof import('./modules/vue-query')['provideVueQuery']>
    readonly reactive: UnwrapRef<typeof import('vue')['reactive']>
    readonly readonly: UnwrapRef<typeof import('vue')['readonly']>
    readonly ref: UnwrapRef<typeof import('vue')['ref']>
    readonly request: UnwrapRef<typeof import('./core/request')['request']>
    readonly resolve: UnwrapRef<typeof import('./core/request')['resolve']>
    readonly resolveComponent: UnwrapRef<typeof import('vue')['resolveComponent']>
    readonly sendRequest: UnwrapRef<typeof import('./core/request')['sendRequest']>
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
    readonly useAuthStore: UnwrapRef<typeof import('./stores/auth-store')['useAuthStore']>
    readonly useBaseUrl: UnwrapRef<typeof import('./composables/baseUrl')['useBaseUrl']>
    readonly useCssModule: UnwrapRef<typeof import('vue')['useCssModule']>
    readonly useCssVars: UnwrapRef<typeof import('vue')['useCssVars']>
    readonly useFetch: UnwrapRef<typeof import('./composables/fetch')['useFetch']>
    readonly useFlashMessage: UnwrapRef<typeof import('./modules/flash-message')['useFlashMessage']>
    readonly useGuard: UnwrapRef<typeof import('./composables/guard')['useGuard']>
    readonly useHead: UnwrapRef<typeof import('@vueuse/head')['useHead']>
    readonly useI18n: UnwrapRef<typeof import('./composables/i18n')['useI18n']>
    readonly useLogger: UnwrapRef<typeof import('./composables/logger')['useLogger']>
    readonly useLuciaAuth: UnwrapRef<typeof import('./composables/auth-lucia')['useLuciaAuth']>
    readonly useNextAuth: UnwrapRef<typeof import('./composables/auth-authjs')['useNextAuth']>
    readonly usePageContext: UnwrapRef<typeof import('./composables/pageContext')['usePageContext']>
    readonly usePageTitle: UnwrapRef<typeof import('./composables/pageTitle')['usePageTitle']>
    readonly useSeoMeta: UnwrapRef<typeof import('@vueuse/head')['useSeoMeta']>
    readonly useService: UnwrapRef<typeof import('./composables/service')['useService']>
    readonly useServiceQuery: UnwrapRef<typeof import('./composables/service')['useServiceQuery']>
    readonly useSession: UnwrapRef<typeof import('./composables/session')['useSession']>
    readonly useSlots: UnwrapRef<typeof import('vue')['useSlots']>
    readonly useSsrLogger: UnwrapRef<typeof import('./composables/logger')['useSsrLogger']>
    readonly useUiStore: UnwrapRef<typeof import('./stores/ui')['useUiStore']>
    readonly useValidation: UnwrapRef<typeof import('./composables/validation')['useValidation']>
    readonly watch: UnwrapRef<typeof import('vue')['watch']>
    readonly watchEffect: UnwrapRef<typeof import('vue')['watchEffect']>
    readonly watchPostEffect: UnwrapRef<typeof import('vue')['watchPostEffect']>
    readonly watchSyncEffect: UnwrapRef<typeof import('vue')['watchSyncEffect']>
  }
}
