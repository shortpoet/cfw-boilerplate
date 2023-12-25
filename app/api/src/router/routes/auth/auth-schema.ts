import { Path, Int } from '@cloudflare/itty-router-openapi'
import { z } from 'zod'
import { UserComponent } from './auth-component'

export const GetUserSchema = {
  tags: ['User'],
  summary: 'Gets a single user',
  parameters: {
    userID: Path(Int, {
      description: 'User ID (integer)'
    })
  },
  responses: {
    '200': {
      description: 'User Object',
      schema: UserComponent
    }
  }
}

export const GetUsersSchema = {
  tags: ['User'],
  summary: 'Gets a list of all users.',
  responses: {
    '200': {
      description: 'List of all users',
      schema: z.array(UserComponent)
    }
  }
}

export const MeSchema = {
  tags: ['User'],
  summary: 'Gets your own profile',
  security: [{ bearerAuth: [] }],
  responses: {
    '200': {
      description: 'Your own user profile',
      schema: UserComponent
    }
  }
}
