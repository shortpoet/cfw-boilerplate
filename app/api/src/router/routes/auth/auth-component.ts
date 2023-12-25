import { User, UserRole, UserType } from '#/types'
import { z } from 'zod'

export const UserComponent = (
  z.object({
    id: z.string({ description: 'User ID' }).length(12),
    username: z.string({ description: "User's username" }),
    email: z.string({ description: 'User email' }).nullable(),
    name: z.string({ description: "User's name" }).nullable(),
    password: z.string({ description: 'User password' }).nullable(),
    userType: z.enum([UserType._, UserType.Credentials, UserType.GitHub, UserType.Email]),
    roles: z.array(z.enum([UserRole.Admin, UserRole.User, UserRole.Guest, UserRole._]))
  }) satisfies z.ZodType<User>
).openapi('User')
export type UserComponentType = z.infer<typeof UserComponent>
