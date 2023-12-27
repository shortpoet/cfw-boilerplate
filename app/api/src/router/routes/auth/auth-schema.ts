import { Path, Int } from '@cloudflare/itty-router-openapi'
import { z } from 'zod'
import {
  UserComponent,
  SessionComponent,
  AuthLoginUsernameBodyComponent,
  AuthLoginEmailBodyComponent,
  AuthRegisterBodyComponent
} from './auth-component'
import { ApiErrorResponseComponent } from '../common-oa'

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
    },
    '404': {
      description: 'Users not found',
      schema: ApiErrorResponseComponent
    },
    '500': {
      description: 'Internal server error',
      schema: ApiErrorResponseComponent
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

export const LoginSchema = {
  tags: ['Auth'],
  summary: 'Fetch a user session',
  responses: {
    '200': {
      description: 'Logged in User Session',
      schema: SessionComponent
    }
  }
}

export const AuthRegisterSchema = {
  tags: ['Auth'],
  summary: 'Register a new user via email and password',
  requestBody: AuthRegisterBodyComponent,
  responses: {
    '200': {
      description: 'User Object',
      schema: SessionComponent
    }
  }
}

export const AuthLoginSchema = {
  tags: ['Auth'],
  summary: 'Log in via your email and password',
  requestBody: z.union([AuthLoginEmailBodyComponent, AuthLoginUsernameBodyComponent]),
  responses: {
    '200': {
      description: 'User Object',
      schema: SessionComponent
    }
  }
}
