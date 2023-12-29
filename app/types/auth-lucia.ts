import { Ref } from 'vue'
import { AuthInstance, LoginOptions, Session, User } from './auth'

export { LuciaAuthInstance }

export const LUCIA_AUTH_GITHUB_OAUTH_STATE = 'github_oauth_state'
export const LUCIA_AUTH_COOKIES_SESSION_TOKEN = `auth_session`
export const LUCIA_AUTH_COOKIES_OPTIONS = {
  httpOnly: undefined,
  secure: false,
  path: '/',
  maxAge: 60 * 60,
  sameSite: undefined
} as const
export const LUCIA_AUTH_COOKIES_OPTIONS_SECURE = {
  httpOnly: false,
  secure: true,
  path: '/',
  maxAge: 60 * 60,
  sameSite: 'none'
} as const

interface LuciaAuthInstance extends AuthInstance {
  authLoading: Ref<boolean>
  authError: Ref<any>
  isLoggedIn: Ref<boolean>
  user?: Ref<User | undefined>
  authState?: Ref<string>
  nonce?: Ref<string>
  session?: Ref<Session | undefined>
  idToken?: Ref<string>
  accessToken?: Ref<string>
  sessionToken?: Ref<string>
  loginRedirectPath?: Ref<string>
  // popupOpen: Ref<boolean>;

  onLoad: () => Promise<void>
  login(options: LoginOptions): Promise<void>
  logout(options?: any): Promise<void>
  setSession: (_session?: Session | string) => Promise<Session | undefined>
  setSessionAuthStore: (session: Session | undefined) => void
  setSessionToken: (token: string) => void
  setLoggedIn: (loggedIn: boolean) => void
  setCurrentUser: (user: User | undefined) => void
  setAccessToken?: (token: string) => void
  setNonce?: (nonce: string) => void
  setAuthState?: (state: string) => void
  setLoginRedirectPath?: (path: string) => void
  setIdToken?: (token: string) => void
}
