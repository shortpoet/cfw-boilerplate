export {
  UserType,
  UserRole,
  User,
  Session,
  AuthInstance,
  LoginOptions,
  LoginResponse,
  LoginResponseSchema,
  LoginOptionsSchema
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
  userId: z.string(),
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

// interface LoginOptions extends Record<string, any> {
//   provider: string
//   register?: boolean
//   username?: string
//   password?: string
//   email?: string
// }

export const LoginOptionsTypesEnum = z.enum(['email', 'username', 'password', 'register', 'oauth'])
export type LoginOptionsTypes = z.infer<typeof LoginOptionsTypesEnum>
const OauthProviders = z.enum(['github', 'google', 'twitter', 'facebook', 'linkedin'])

const LoginOptionsOauthSchema = z.object({
  type: z.literal(LoginOptionsTypesEnum.Enum.oauth),
  provider: OauthProviders,
  username: z.undefined(),
  password: z.undefined(),
  email: z.undefined()
})

const LoginOptionsRegisterSchema = z.object({
  type: z.literal(LoginOptionsTypesEnum.Enum.register),
  provider: z.undefined(),
  username: z.string(),
  password: z.string(),
  email: z.string()
})

const LoginOptionsUsernameSchema = z.object({
  type: z.literal(LoginOptionsTypesEnum.Enum.username),
  provider: z.undefined(),
  password: z.string(),
  username: z.string(),
  email: z.string().optional()
})

const LoginOptionsEmailSchema = z.object({
  type: z.literal(LoginOptionsTypesEnum.Enum.email),
  provider: z.undefined(),
  password: z.string(),
  username: z.string().optional(),
  email: z.string()
})

const LoginOptionsSchema = z.discriminatedUnion('type', [
  LoginOptionsOauthSchema,
  LoginOptionsRegisterSchema,
  LoginOptionsUsernameSchema,
  LoginOptionsEmailSchema
])

// const LoginOptionsLoginSchema = z
//   .object({
//     type: z.literal(LoginOptionsTypesEnum.Enum.login),
//     provider: z.undefined(),
//     password: z.string(),
//     username: z.string().optional(),
//     email: z.string().optional()
//   })
//   .and(
//     z.union(
//       [
//         z.object({ username: z.string(), email: z.undefined() }),
//         z.object({ username: z.undefined(), email: z.string() }),
//         z.object({ username: z.string(), email: z.string() })
//       ],
//       { errorMap: (issue, ctx) => ({ message: 'Either username or email is required' }) }
//     )
//   )

// const LoginOptionsSchema = z.union([
//   LoginOptionsRegisterSchema,
//   LoginOptionsLoginSchema,
//   LoginOptionsCommonSchema
// ])

// const LoginOptionsSchema = z.intersection(
//   LoginOptionsCommonSchema,
//   z.union([LoginOptionsRegisterSchema, LoginOptionsLoginSchema])
// )
type LoginOptions = z.infer<typeof LoginOptionsSchema>

const RegisterResponseSchema = z.object({
  session: BaseSessionSchema.partial(),
  url: z.undefined()
})
type RegisterResponse = z.infer<typeof RegisterResponseSchema>

const LoginPasswordResponseSchema = z.object({
  session: BaseSessionSchema.partial(),
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
