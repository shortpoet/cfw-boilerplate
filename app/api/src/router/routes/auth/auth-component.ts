import { Session, User, UserRole, UserRoleSchema, UserType, UserTypeSchema } from '#/types'
import { z } from 'zod'

export const UserComponent = (
  z.object({
    userId: z.string({ description: 'User ID' }).length(12),
    username: z.string({ description: "User's username" }),
    roles: z.array(UserRoleSchema),
    userTypes: z.array(UserTypeSchema),
    email_verified: z.boolean({ description: 'Is user email verified' }),
    email: z.string({ description: 'User email' }).optional(),
    avatar_url: z.string({ description: 'User avatar URL' }).optional(),
    name: z.string({ description: "User's name" }).optional(),
    password: z.string({ description: 'User password' }).optional()
  }) satisfies z.ZodType<User>
).openapi('User')
export type UserComponentType = z.infer<typeof UserComponent>

export const SessionComponent = (
  z.object({
    sessionId: z.string({ description: 'Session ID' }).length(12),
    user: UserComponent,
    activePeriodExpiresAt: z.string({ description: 'Session expiry date' }),
    idlePeriodExpiresAt: z.string({ description: 'Session expiry date' }),
    state: z.string({ description: 'Session state' }),
    fresh: z.boolean({ description: 'Is session fresh' })
  }) satisfies z.ZodType<Session>
).openapi('Session')
export type SessionComponentType = z.infer<typeof SessionComponent>

export const AuthRegisterBodyComponent = z
  .object({
    //TODO: use Regex here
    username: z.string({ required_error: 'username is required' }).min(3).max(20),
    email: z.string({ required_error: 'email is required' }).email(),
    password: z.string({ required_error: 'password is required' }).min(8).max(64)
  })
  .openapi('AuthRegisterBody')
export type AuthRegisterBodyType = z.infer<typeof AuthRegisterBodyComponent>

export const AuthLoginEmailBodyComponent = z
  .object({
    email: z.string({ required_error: 'email is required' }).email(),
    password: z.string({ required_error: 'password is required' }).min(8).max(64)
  })
  .openapi('AuthLoginEmailBody')
export type AuthLoginEmailBodyType = z.infer<typeof AuthLoginEmailBodyComponent>

export const AuthLoginUsernameBodyComponent = z
  .object({
    username: z.string({ required_error: 'username is required' }).min(3).max(20),
    password: z.string({ required_error: 'password is required' }).min(8).max(64)
  })
  .openapi('AuthLoginUsernameBody')
export type AuthLoginUsernameBodyType = z.infer<typeof AuthLoginUsernameBodyComponent>

export const AuthLoginBodyComponent = z
  .union([AuthLoginEmailBodyComponent, AuthLoginUsernameBodyComponent])
  .openapi('AuthLoginBody')
export type AuthLoginBodyType = z.infer<typeof AuthLoginBodyComponent>

export const OauthLoginResponseComponent = z
  .object({
    url: z.string({ description: 'OAuth login URL' })
  })
  .openapi('OauthLoginResponse')
export type OauthLoginResponseType = z.infer<typeof OauthLoginResponseComponent>
