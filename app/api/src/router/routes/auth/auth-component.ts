import { Session, User, UserRole, UserType } from '#/types'
import { z } from 'zod'

export const UserComponent = (
  z.object({
    id: z.string({ description: 'User ID' }).length(12),
    username: z.string({ description: "User's username" }),
    userType: z.enum([UserType._, UserType.Credentials, UserType.GitHub, UserType.Email]),
    roles: z.array(z.enum([UserRole.Admin, UserRole.User, UserRole.Guest, UserRole._])),
    email: z.string({ description: 'User email' }).optional(),
    name: z.string({ description: "User's name" }).optional(),
    password: z.string({ description: 'User password' }).optional()
  }) satisfies z.ZodType<User>
).openapi('User')
export type UserComponentType = z.infer<typeof UserComponent>

export const AuthRegisterBodyComponent = z.object({
  //TODO: use Regex here
  username: z.string({ required_error: 'username is required' }).min(3).max(20),
  email: z.string({ required_error: 'email is required' }).email(),
  password: z.string({ required_error: 'password is required' }).min(8).max(64)
})
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

export const SessionComponent = (
  z.object({
    sessionId: z.string({ description: 'Session ID' }).length(12),
    user: UserComponent,
    activePerdiodExpiresAt: z.string({ description: 'Session expiry date' }),
    idlePerdiodExpiresAt: z.string({ description: 'Session expiry date' }),
    state: z.string({ description: 'Session state' }),
    fresh: z.boolean({ description: 'Is session fresh' })
  }) satisfies z.ZodType<Session>
).openapi('Session')
export type SessionComponentType = z.infer<typeof SessionComponent>
