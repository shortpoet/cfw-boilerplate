export { UserType, UserRole, User, Session, AuthInstance, LoginOptions }

type ISODateString = string

type User = UserUnion
type UserUnion = BaseUser

type Session = SessionUnion
type SessionUnion = BaseSession

enum UserType {
  _ = 'not_set',
  Email = 'email',
  GitHub = 'github',
  Credentials = 'credentials'
}

enum UserRole {
  _ = 'not_set',
  Guest = 'guest',
  Admin = 'admin',
  User = 'user'
}

type BaseSession = {
  sessionId: string
  user: User
  activePerdiodExpiresAt: ISODateString
  idlePerdiodExpiresAt: ISODateString
  state: string
  fresh: boolean
}

type BaseUser = {
  id: string
  roles: UserRole[]
  userType: UserType
  username: string
  email?: string | undefined
  avatar_url?: string | undefined
  name?: string | undefined
}

interface AuthInstance {
  authLoading: Ref<boolean>
  authError: Ref<any>
  isLoggedIn: Ref<boolean>
  user?: Ref<User | undefined>
  authState?: Ref<string>
  nonce?: Ref<string>
  session?: Ref<Session | undefined>
  idToken?: Ref<string>
  accessToken?: Ref<string>
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

type LoginOptions = {
  provider: string
}
