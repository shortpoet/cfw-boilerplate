export {
  UserType,
  UserRole,
  User,
  Session,
  AuthInstance,
  LoginOptions,
  LoginResponse,
  LoginResponseSchema
}
import { z } from 'zod'

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

const UserTypeSchema = z.enum(['not_set', 'email', 'github', 'credentials'])

enum UserRole {
  _ = 'not_set',
  Guest = 'guest',
  Admin = 'admin',
  User = 'user'
}

const UserRoleSchema = z.enum(['not_set', 'guest', 'admin', 'user'])

const BaseUserSchema = z.object({
  id: z.string(),
  roles: z.array(UserRoleSchema),
  userType: UserTypeSchema,
  username: z.string(),
  email: z.string().optional(),
  avatar_url: z.string().optional(),
  name: z.string().optional()
})
type BaseUser = z.infer<typeof BaseUserSchema>

const BaseSessionSchema = z.object({
  sessionId: z.string(),
  user: BaseUserSchema,
  activePerdiodExpiresAt: z.string(),
  idlePerdiodExpiresAt: z.string(),
  state: z.string(),
  fresh: z.boolean()
})
type BaseSession = z.infer<typeof BaseSessionSchema>

interface LoginOptions extends Record<string, any> {
  provider: string
  register?: boolean
  username?: string
  password?: string
  email?: string
}

const RegisterResponseSchema = z.object({
  session: BaseSessionSchema,
  url: z.undefined()
})
type RegisterResponse = z.infer<typeof RegisterResponseSchema>

const LoginPasswordResponseSchema = z.object({
  session: BaseSessionSchema,
  url: z.undefined()
})
type LoginPasswordResponse = z.infer<typeof LoginPasswordResponseSchema>

const LoginProviderResponseSchema = z.object({
  url: z.string(),
  session: z.undefined()
})
type LoginProviderResponse = z.infer<typeof LoginProviderResponseSchema>

const LoginResponseSchema = z.union([
  RegisterResponseSchema,
  LoginPasswordResponseSchema,
  LoginProviderResponseSchema
])
type LoginResponse = z.infer<typeof LoginResponseSchema>

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
