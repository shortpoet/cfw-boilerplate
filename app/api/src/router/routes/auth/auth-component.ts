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

export const AuthRegisterBody = z.object({
  //TODO: use Regex here
  username: z.string({ required_error: 'username is required' }).min(3).max(20),
  email: z.string({ required_error: 'email is required' }).email(),
  password: z.string({ required_error: 'password is required' }).min(8).max(64)
})
export type AuthRegisterBodyType = z.infer<typeof AuthRegisterBody>

export const AuthLoginBody = z
  .object({
    //TODO: use Regex here
    username: z
      .string({ required_error: 'username or email is required' })
      .min(3)
      .max(20)
      .optional(),
    email: z.string({ required_error: 'email or username is required' }).email().optional(),
    password: z.string({ required_error: 'password is required' }).min(8).max(64)
  })
  .and(
    z.union(
      [
        z.object({ username: z.string(), email: z.undefined() }),
        z.object({ username: z.undefined(), email: z.string() }),
        z.object({ username: z.string(), email: z.string() })
      ],
      { errorMap: (issue, ctx) => ({ message: 'Either username or email is required' }) }
    )
  )
// .refine((schema) => schema.username || schema.email, "Either 'username' or 'email' is required")
export type AuthLoginBodyType = z.infer<typeof AuthLoginBody>

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
