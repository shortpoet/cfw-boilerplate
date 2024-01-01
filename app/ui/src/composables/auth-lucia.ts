import {
  LuciaAuthInstance,
  User,
  Session,
  LoginOptions,
  BaseSessionSchema,
  LoginOptionsSchema,
  LoginProviderResponse,
  LoginRedirectResponseSchema,
  LoginHTMLResponseSchema
} from '#/types'
import { storeToRefs } from 'pinia'
import { ApiError, AuthLoginResponse, AuthService } from '..'

export {
  LUCIAAUTH_COOKIES_SESSION_TOKEN,
  // LUCIAAUTH_COOKIES_USER_TOKEN,
  LUCIAAUTH_SESSION_TOKEN_EXPIRY,
  useLuciaAuth
}

const AuthSymbol: InjectionKey<LuciaAuthInstance> = Symbol()

const user = ref<User>()
const session = ref<Session | undefined>()
const token = ref<string>()
const authLoading = ref(true)
const authError = ref<any>()
const isLoggedIn = ref(false)
const audience = `https://ssr.shortpoet.com`
const scope = 'openid profile email offline_access'
const response_type = 'code'

// const LUCIAAUTH_COOKIES_USER_TOKEN = `${process.env.VITE_APP_NAME}-next-user-token`;
const LUCIAAUTH_COOKIES_SESSION_TOKEN = `auth_session`
const LUCIAAUTH_SESSION_TOKEN_EXPIRY = 60 * 60 // 1 hour

export const provideLuciaAuth = () => {
  const auth = {
    user,
    authLoading,
    isLoggedIn,
    authError,
    session,

    onLoad: async () => {},
    login: async () => {},
    logout: async () => {},
    setSession: async () => ({}) as Session,
    setSessionAuthStore: async () => {},
    setAccessToken: async () => {},
    setSessionToken: async () => {},
    setLoggedIn: async () => {},
    setCurrentUser: async () => {}
  }

  provide(AuthSymbol, auth)
}

const useLuciaAuth = () => {
  const auth = inject(AuthSymbol)
  if (!auth) throw new Error('provideAuth() not called in parent')

  const authStore = useAuthStore()
  const {
    authState,
    isLoggedIn,
    nonce,
    idToken,
    accessToken,
    currentUser,
    loginRedirectPath,
    sessionToken
  } = storeToRefs(authStore)
  const {
    initRandomAuthState,
    initRandomNonce,
    setIdToken,
    setLoggedIn,
    setCurrentUser,
    setAccessToken,
    setSessionToken,
    setNonce,
    setAuthState,
    setLoginRedirectPath,
    setSession: setSessionAuthStore
  } = authStore
  setNonce(nonce.value !== '' ? nonce.value : initRandomNonce())
  setAuthState(authState.value !== '' ? authState.value : initRandomAuthState())
  auth.authState = ref(authStore.authState)
  auth.nonce = ref(authStore.nonce)
  auth.isLoggedIn = isLoggedIn
  auth.idToken = idToken
  auth.accessToken = accessToken
  auth.sessionToken = sessionToken
  auth.user = currentUser
  auth.loginRedirectPath = loginRedirectPath
  auth.setIdToken = setIdToken
  auth.setLoggedIn = setLoggedIn
  auth.setCurrentUser = setCurrentUser
  auth.setAccessToken = setAccessToken
  auth.setSessionToken = setSessionToken
  auth.setNonce = setNonce
  auth.setAuthState = setAuthState
  auth.setLoginRedirectPath = setLoginRedirectPath
  auth.setSessionAuthStore = setSessionAuthStore
  // console.log(`authStore: ${JSON.stringify(authStore, null, 2)}`);

  const onLoad = async () => {
    // const sessionCookie = getCookie(LUCIAAUTH_COOKIES_SESSION_TOKEN);
    // if (sessionCookie) {
    //   const session = await auth.setSession(sessionCookie);
    // }
    authLoading.value = false
    // const correlationId = getCookie(X_CORRELATION_ID);
  }

  const setSession = async (_session?: Session | string): Promise<Session | undefined> => {
    console.log(`[ui] [useAuth] [setSession] -> _session ->`)
    console.log(_session)
    if (!_session) {
      console.log(`[ui] [useAuth] [setSession] -> no session setting authStore to default`)
      authStore.clearState()
      return
    }
    let session
    if (typeof _session === 'string') {
      console.log(`[ui] [useAuth] [setSession] -> _session is string getting session using token`)
      // session = await useSession(_session)
      // override annoying/expensive useSession() call - could be problematic
      session = authStore.session
    }
    if (!session) return
    console.log(`[ui] [useAuth] [setSession] -> session ->`)
    console.log(session)
    auth.setCurrentUser(session.user)
    auth.setSessionToken(session.sessionId)
    auth.setLoggedIn(true)
    auth.setSessionAuthStore(session)
    return session
  }
  const login = async (opts: LoginOptions) => {
    const { logger, correlationId } = useSsrLogger()
    logger.info(`[ui] [useAuth] [login] -> correlationId: ${correlationId}`)
    const isLogin = opts.type === 'email' || opts.type === 'username'
    const success = LoginOptionsSchema.safeParse(opts)
    if (!success.success) {
      console.error(`[ui] [useAuth] [login] -> invalid login options`)
      console.error(success.error)
      return
    }
    if (opts.type === 'register') {
      const { data, dataLoading, error } = await useService<AuthLoginResponse>(
        AuthService.postRegisterPasswordUser({
          requestBody: { username: opts.username, password: opts.password, email: opts.email }
        })
      )
      auth.authError.value = error.value
      if (auth.authError.value || !data.value) {
        logger.error(`[ui] [useAuth] [login] -> auth.authError.value:`)
        logger.error(auth.authError.value)
        return
      }
      auth.authLoading.value = dataLoading.value
      const success = BaseSessionSchema.safeParse(data.value)
      if (!success.success) {
        logger.error(`[ui] [useAuth] [login] -> success.error:`)
        logger.error(success.error)
        auth.authError.value = success.error
        return
      }
      auth.setSession(success.data)
    }
    if (isLogin) {
      const { data, dataLoading, error } = await useService<AuthLoginResponse>(
        AuthService.postLoginPasswordUser({
          requestBody:
            opts.type === 'email'
              ? { password: opts.password, email: opts.email }
              : { username: opts.username, password: opts.password }
        })
      )
      auth.authError.value = error.value
      if (auth.authError.value || !data.value) {
        logger.error(`[ui] [useAuth] [login] -> auth.authError.value:`)
        logger.error(auth.authError.value)
        return
      }
      auth.authLoading.value = dataLoading.value
      console.log(`[ui] [useAuth] [login] -> data:`)
      console.log(data)
      const success = LoginRedirectResponseSchema.safeParse(data.value)
      if (!success.success) {
        logger.error(`[ui] [useAuth] [login] -> success.error:`)
        logger.error(success.error)
        auth.authError.value = success.error
        return
      }
      // auth.setSession(success.data)
      window.location.replace(success.data)
    }
    if (opts.type === 'oauth') {
      const { data, error, dataLoading } = await useService<LoginProviderResponse>(
        AuthService.getLoginGithub()
      )
      auth.authError.value = error.value
      if (auth.authError.value || !data.value) {
        logger.error(`[ui] [useAuth] [login] -> auth.authError.value:`)
        logger.error(auth.authError.value)
        return
      }
      auth.authLoading.value = dataLoading.value
      const success = LoginRedirectResponseSchema.safeParse(data.value)
      if (!success.success) {
        logger.error(`[ui] [useAuth] [login] -> success.error:`)
        logger.error(success.error)
        auth.authError.value = success.error
        return
      }
      window.location.replace(success.data)
    }
  }

  const logout = async () => {
    const { urlBaseApi } = useBaseUrl()
    const url = new URL(`${urlBaseApi}/${process.env.AUTH_PATH}/logout`)
    const { data, error, dataLoading } = await useFetch<{}>(url.href, {
      sessionToken: auth.sessionToken?.value
    })
    auth.authError.value = error.value
    auth.authLoading.value = dataLoading.value
    if (data.value) {
      auth.setSession()
      window.location.replace('/auth/login')
    }
  }

  auth.onLoad = onLoad
  auth.login = login
  auth.logout = logout
  auth.setSession = setSession
  return auth
}
