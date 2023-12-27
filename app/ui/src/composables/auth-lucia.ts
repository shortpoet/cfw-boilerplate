import { LuciaAuthInstance, User, Session, LoginOptions } from '#/types'
import { storeToRefs } from 'pinia'

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
      session = await useSession(_session)
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
    if (auth.isLoggedIn.value) window.location.replace('/')
    const { urlBaseApi, urlBaseApp } = useBaseUrl()
    const base = `${process.env.NODE_ENV === 'production' ? urlBaseApp : urlBaseApi}`
    const path = !opts.register ? 'login' : 'register'
    const url = new URL(`${base}/${process.env.AUTH_PATH}/${path}/${opts.provider}`)
    console.log(`[ui] [useAuth] login url: ${url.href}`)
    const isPassword = opts.provider === 'password'

    const init = {
      method: isPassword ? 'POST' : 'GET',
      headers: {
        'Content-Type': 'application/json'
        // cookie: `${LUCIAAUTH_COOKIES_SESSION_TOKEN}=${sessionToken.value}`,
      },
      body: isPassword
        ? JSON.stringify({ username: opts.username, password: opts.password, email: opts.email })
        : undefined
    }
    console.log(`[ui] [useAuth] login init: ${JSON.stringify(init, null, 2)}`)
    // return
    const { data, error, dataLoading } = await useFetch<{ url: string }>(url.href, init)
    const { logger, correlationId } = useSsrLogger()

    if (error.value) {
      logger.error(`[ui] [useAuth] error:`)
      console.log(error.value)
      logger.error(error.value)
      auth.authError.value = error.value
    }
    if (dataLoading.value) {
      logger.info(`[ui] [useAuth] dataLoading: ${dataLoading.value}`)
    }
    if (data.value) {
      logger.debug(`[ui] [useAuth] data: ${JSON.stringify(data.value, null, 2)}`)
      console.log(`[ui] [useAuth] data: ${JSON.stringify(data.value, null, 2)}`)
      // if (!isPassword) window.location.replace(data.value.url)
    }
  }

  const logout = async () => {
    const { urlBaseApi } = useBaseUrl()
    const url = new URL(`${urlBaseApi}/${process.env.AUTH_PATH}/logout`)
    // const { data, error, dataLoading } = {
    //   data: ref({}),
    //   error: ref(undefined),
    //   dataLoading: ref(false)
    // }
    const { data, error, dataLoading } = await useFetch<{ url: string }>(url.href, {
      sessionToken: auth.sessionToken?.value
    })
    if (error.value) {
      console.error(`error: ${error.value}`)
    }

    if (dataLoading.value) {
      console.log(`dataLoading: ${dataLoading.value}`)
    }
    if (data.value) {
      console.log(`data: ${JSON.stringify(data.value, null, 2)}`)
      auth.setSession()
      // window.location.replace('/')
    }
  }

  auth.onLoad = onLoad
  auth.login = login
  auth.logout = logout
  auth.setSession = setSession
  return auth
}
