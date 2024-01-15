import { z } from 'zod'
import { LoginFormEvent } from './ui'

export enum UserType {
  _ = 'not_set',
  Email = 'email',
  GitHub = 'github',
  Credentials = 'credentials'
}

export const UserTypeSchema = z.enum(['not_set', 'email', 'github', 'credentials'])

export enum UserRole {
  _ = 'not_set',
  Guest = 'guest',
  Admin = 'admin',
  User = 'user'
}

export const UserRoleSchema = z.enum(['not_set', 'guest', 'admin', 'user'])

export const UserSchema = z.object({
  userId: z.string({ description: 'User ID' }),
  username: z.string({ description: "User's username" }),
  roles: z.array(UserRoleSchema),
  userTypes: z.array(UserTypeSchema),
  email_verified: z.boolean({ description: 'Is user email verified' }),
  email: z.string({ description: 'User email' }).optional(),
  avatar_url: z.string({ description: 'User avatar URL' }).optional(),
  name: z.string({ description: "User's name" }).optional(),
  password: z.string({ description: 'User password' }).optional()
})
export type User = z.infer<typeof UserSchema>

export const SessionSchema = z.object({
  sessionId: z.string({ description: 'Session ID' }),
  user: UserSchema,
  activePeriodExpiresAt: z.string({ description: 'Session expiry date' }),
  idlePeriodExpiresAt: z.string({ description: 'Session expiry date' }),
  state: z.string({ description: 'Session state' }),
  fresh: z.boolean({ description: 'Is session fresh' })
})
export type Session = z.infer<typeof SessionSchema>

export const VerificationCodeTableSchema = z.object({
  user_id: z.string(),
  code: z.string(),
  expires: z.number()
})
export type VerificationCodeTable = z.infer<typeof VerificationCodeTableSchema>

export const AuthRegisterBodySchema = z.object({
  //TODO: use Regex here
  username: z.string({ required_error: 'username is required' }).min(3).max(20),
  email: z.string({ required_error: 'email is required' }).email(),
  password: z.string({ required_error: 'password is required' }).min(8).max(64)
})
export type AuthRegisterBody = z.infer<typeof AuthRegisterBodySchema>

export const AuthLoginEmailBodySchema = z.object({
  email: z.string({ required_error: 'email is required' }).email(),
  password: z.string({ required_error: 'password is required' }).min(8).max(64)
})
export type AuthLoginEmailBody = z.infer<typeof AuthLoginEmailBodySchema>

export const AuthLoginUsernameBodySchema = z.object({
  username: z.string({ required_error: 'username is required' }).min(3).max(20),
  password: z.string({ required_error: 'password is required' }).min(8).max(64)
})
export type AuthLoginUsernameBody = z.infer<typeof AuthLoginUsernameBodySchema>

export const AuthLoginBodySchema = z.union([AuthLoginEmailBodySchema, AuthLoginUsernameBodySchema])
export type AuthLoginBody = z.infer<typeof AuthLoginBodySchema>

export const LoginOptionsTypesEnum = z.enum([
  'email',
  'username',
  'register',
  'oauth',
  'verify_email',
  'verify_code'
])
export type LoginOptionsTypes = z.infer<typeof LoginOptionsTypesEnum>
export const OauthProvidersEnum = z.enum(['github', 'google', 'twitter', 'facebook', 'linkedin'])
export type OauthProviders = z.infer<typeof OauthProvidersEnum>

export const OauthLoginBodySchema = z.object({
  provider: OauthProvidersEnum,
  redirect_url: z.string({ description: 'OAuth redirect URI' }).url().optional()
})
export type OauthLoginBody = z.infer<typeof OauthLoginBodySchema>

export const OauthLoginResponseSchema = z.string({ description: 'OAuth redirect HTML' })
export type OauthLoginResponse = z.infer<typeof OauthLoginResponseSchema>

export const LoginRedirectResponseSchema = z.string()
export type LoginProviderResponse = z.infer<typeof LoginRedirectResponseSchema>

export const LoginHTMLResponseSchema = z.string()
export type LoginHTMLResponse = z.infer<typeof LoginHTMLResponseSchema>

export const VerifyEmailResponseSchema = z.object({
  timeSent: z.string({ description: 'Time verification email was sent' }),
  expiration: z.string({ description: 'Time verification code expires' })
})
export type VerifyEmailResponse = z.infer<typeof VerifyEmailResponseSchema>

/* Client */

export const LoginOauthOptionsSchema = z.object({
  provider: OauthProvidersEnum
})
export type LoginOauthOptions = z.infer<typeof LoginOauthOptionsSchema>

export const VerifyEmailSchema = z.object({
  email: z.string({ description: 'Email' }).email()
})

export const VerifyCodeSchema = z.object({
  code: z.number({ description: 'Verification code' })
})

export const VerifySchema = z.union([VerifyEmailSchema, VerifyCodeSchema])

export const LoginFormSchema = z.object({
  type: LoginOptionsTypesEnum,
  username: z.string({ description: 'Username' }).optional(),
  email: z.string({ description: 'Email' }).optional(),
  password: z.string({ description: 'Password' }).optional(),
  verificationCode: z.string({ description: 'Verification code' }).optional(),
  provider: OauthProvidersEnum.optional()
})
export type LoginForm = z.infer<typeof LoginFormSchema>

export interface AuthInstance {
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
  login(options: LoginFormEvent['form']): Promise<void>
  loginOauth(options: LoginFormEvent['form']): Promise<void>
  register(options: LoginFormEvent['form']): Promise<void>
  logout(options?: any): Promise<void>
  setSession: (_session?: Session | string) => Promise<Session | undefined>
  setSessionAuthStore: (session: Session | undefined) => void
  setSessionToken: (token: string) => void
  setLoggedIn: (loggedIn: boolean) => void
  setCurrentUser: (user: User | undefined) => void
  verifyEmail(options: LoginFormEvent['form']): Promise<VerifyEmailResponse | undefined>
  verifyCode(options: LoginFormEvent['form']): Promise<void>
  setAccessToken?: (token: string) => void
  setNonce?: (nonce: string) => void
  setAuthState?: (state: string) => void
  setLoginRedirectPath?: (path: string) => void
  setIdToken?: (token: string) => void
}
