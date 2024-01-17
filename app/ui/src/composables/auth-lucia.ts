import {
  LuciaAuthInstance,
  User,
  Session,
  SessionSchema,
  LoginProviderResponse,
  LoginRedirectResponseSchema,
  LoginHTMLResponseSchema,
  AuthRegisterBody,
  AuthRegisterBodySchema,
  LoginOauthOptions,
  LoginOauthOptionsSchema,
  AuthLoginBody,
  AuthLoginBodySchema,
  LoginFormEvent,
  VerifyEmailBodySchema,
  VerifyCodeBodySchema,
  VerifySchema,
  VerifyEmailResponseSchema
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
    loginOauth: async () => {},
    register: async () => {},
    verifyEmail: async () => undefined,
    verifyCode: async () => undefined,
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

  const { logger, correlationId } = useSsrLogger()

  const setSession = async (_session?: Session | string): Promise<Session | undefined> => {
    // console.log(`[ui] [useAuth] [setSession] -> _session ->`)
    // console.log(_session)
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
    } else {
      // console.log(`[ui] [useAuth] [setSession] -> _session is object`)
      session = _session
    }
    if (!session) return
    console.log(`[ui] [useAuth] [setSession] -> session ->`)
    console.log(session)
    auth.setCurrentUser(session.user)
    auth.setSessionToken(session.sessionId)
    auth.setLoggedIn(true)
    auth.setSessionAuthStore(session)
    auth.session = ref(session)
    return session
  }
  const login = async (opts: LoginFormEvent['form']) => {
    logger.info(`[ui] [useAuth] [login] -> correlationId: ${correlationId}`)
    console.log(`[ui] [useAuth] [login] -> opts:`)
    console.log(opts)
    const loginOpts = AuthLoginBodySchema.safeParse(opts)
    if (!loginOpts.success) {
      console.error(`[ui] [useAuth] [login] -> invalid login options`)
      console.error(loginOpts.error)
      return
    }
    console.log(`[ui] [useAuth] [login] -> loginOpts:`)
    console.log(loginOpts.data)
    const password = loginOpts.data.password
    const requestBody =
      'username' in loginOpts.data
        ? { username: loginOpts.data.username, password }
        : { email: loginOpts.data.email, password }
    console.log(`[ui] [useAuth] [login] -> requestBody:`)
    console.log(requestBody)
    const { data, dataLoading, error } = await useService<AuthLoginResponse>(
      AuthService.postLoginPasswordUser({ requestBody })
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
  const loginOauth = async (opts: LoginFormEvent['form']) => {
    logger.info(`[ui] [useAuth] [login] -> correlationId: ${correlationId}`)
    console.log(`[ui] [useAuth] [login] -> opts:`)
    console.log(opts)
    const loginOpts = LoginOauthOptionsSchema.safeParse(opts)
    if (!loginOpts.success) {
      console.error(`[ui] [useAuth] [login] -> invalid login options`)
      console.error(loginOpts.error)
      return
    }
    const { data, error, dataLoading } = await useService<LoginProviderResponse>(
      AuthService.getLoginOauth({ provider: loginOpts.data.provider })
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
  const register = async (opts: LoginFormEvent['form']) => {
    logger.info(`[ui] [useAuth] [register] -> correlationId: ${correlationId}`)
    console.log(`[ui] [useAuth] [register] -> opts:`)
    console.log(opts)
    const registerOpts = AuthRegisterBodySchema.safeParse(opts)
    if (!registerOpts.success) {
      console.error(`[ui] [useAuth] [login] -> invalid login options`)
      console.error(registerOpts.error)
      return
    }
    const { username, password, email } = registerOpts.data
    const { data, dataLoading, error } = await useService<AuthLoginResponse>(
      AuthService.postRegisterPasswordUser({
        requestBody: { username, password, email }
      })
    )
    auth.authError.value = error.value
    if (auth.authError.value || !data.value) {
      logger.error(`[ui] [useAuth] [register] -> auth.authError.value:`)
      logger.error(auth.authError.value)
      return
    }
    auth.authLoading.value = dataLoading.value
    const success = LoginRedirectResponseSchema.safeParse(data.value)
    if (!success.success) {
      logger.error(`[ui] [useAuth] [register] -> success.error:`)
      logger.error(success.error)
      auth.authError.value = success.error
      return
    }
    auth.setSession(success.data)
  }

  const verifyEmail = async (opts: LoginFormEvent['form']) => {
    logger.info(`[ui] [useAuth] [verifyEmail] -> correlationId: ${correlationId}`)
    console.log(`[ui] [useAuth] [verifyEmail] -> opts:`)
    console.log(opts)
    const _email = VerifyEmailBodySchema.safeParse(opts)
    if (!_email.success) {
      console.error(`[ui] [useAuth] [verifyEmail] -> invalid login options`)
      console.error(_email.error)
      return
    }
    const { data, dataLoading, error } = await useService<any>(
      AuthService.getVerificationEmailGet({ email: _email.data.email })
    )
    auth.authError.value = error.value
    if (auth.authError.value || !data.value) {
      logger.error(`[ui] [useAuth] [verifyEmail] -> auth.authError.value:`)
      logger.error(auth.authError.value)
      return
    }
    auth.authLoading.value = dataLoading.value
    const success = VerifyEmailResponseSchema.safeParse(data.value)
    if (!success.success) {
      logger.error(`[ui] [useAuth] [verifyEmail] -> success.error:`)
      logger.error(success.error)
      auth.authError.value = success.error
      return
    }
    return success.data
  }
  const verifyCode = async (opts: LoginFormEvent['form']) => {
    logger.info(`[ui] [useAuth] [verifyCode] -> correlationId: ${correlationId}`)
    console.log(`[ui] [useAuth] [verifyCode] -> opts:`)
    console.log(opts)
    const _opts = VerifyCodeBodySchema.safeParse(opts)
    if (!_opts.success) {
      console.error(`[ui] [useAuth] [verifyCode] -> invalid login options`)
      console.error(_opts.error)
      return
    }
    const { data, dataLoading, error } = await useService<Session>(
      AuthService.getVerificationTokenGet({ requestBody: _opts.data })
    )
    auth.authError.value = error.value
    if (auth.authError.value || !data.value) {
      logger.error(`[ui] [useAuth] [verifyCode] -> auth.authError.value:`)
      logger.error(auth.authError.value)
      return
    }
    auth.authLoading.value = dataLoading.value
    const success = SessionSchema.safeParse(data.value)
    if (!success.success) {
      logger.error(`[ui] [useAuth] [verifyCode] -> success.error:`)
      logger.error(success.error)
      auth.authError.value = success.error
      return
    }
    auth.setSession(success.data)
    console.log(`[ui] [useAuth] [verifyCode] -> success.data:`)
    console.log(success.data)
    return success.data
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
  auth.loginOauth = loginOauth
  auth.register = register
  auth.verifyEmail = verifyEmail
  auth.verifyCode = verifyCode
  auth.logout = logout
  auth.setSession = setSession
  return auth
}
