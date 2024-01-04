import { Path, Int, Query, Str } from '@cloudflare/itty-router-openapi'
import { z } from 'zod'

import { ApiErrorResponseComponent } from '../common-oa'
import {
  AuthLoginBodySchema,
  AuthLoginEmailBodySchema,
  AuthLoginUsernameBodySchema,
  AuthRegisterBodySchema,
  OauthLoginResponseSchema,
  LoginRedirectResponseSchema,
  SessionSchema,
  UserSchema
} from '#/types'

export const UserComponent = UserSchema.openapi('User')
export const SessionComponent = SessionSchema.openapi('Session')
export const AuthRegisterBodyComponent = AuthRegisterBodySchema.openapi('AuthRegisterBody')

export const AuthLoginEmailBodyComponent = AuthLoginEmailBodySchema.openapi('AuthLoginEmailBody')

export const AuthLoginUsernameBodyComponent =
  AuthLoginUsernameBodySchema.openapi('AuthLoginUsernameBody')

export const AuthLoginBodyComponent = AuthLoginBodySchema.openapi('AuthLoginBody')

export const OauthLoginResponseComponent = OauthLoginResponseSchema.openapi('OauthLoginResponse')

enum ServerMessages {
  UserNotFound = 'User not found',
  UsersNotFound = 'Users not found',
  BadResponse = 'Bad response',
  InternalServerError = 'Internal Server Error',
  NoContent = 'No content'
}

export const AuthUserSchema = {
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

export const AuthUsersSchema = {
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
      description: 'Internal Server Error',
      schema: ApiErrorResponseComponent
    }
  }
}

export const AuthMeSchema = {
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

export const AuthSessionSchema = {
  tags: ['Auth'],
  summary: 'Fetch a user session',
  responses: {
    '200': {
      description: 'Logged in User Session',
      schema: SessionComponent
    },
    '404': {
      description: 'Session not found',
      schema: ApiErrorResponseComponent
    },
    '500': {
      description: 'Internal Server Error',
      schema: ApiErrorResponseComponent
    }
  }
}

export const AuthSessionsSchema = {
  tags: ['Auth'],
  summary: 'Fetch all user sessions',
  responses: {
    '200': {
      description: 'List of all user sessions',
      schema: z.array(SessionComponent)
    },
    '404': {
      description: 'Sessions not found',
      schema: ApiErrorResponseComponent
    },
    '500': {
      description: 'Internal Server Error',
      schema: ApiErrorResponseComponent
    }
  }
}

export const AuthRegisterSchema = {
  tags: ['Auth'],
  summary: 'Register a new user via email and password',
  requestBody: AuthRegisterBodyComponent,
  responses: {
    '200': {
      description: 'Redirect URL', // TODO make params?
      schema: LoginRedirectResponseSchema.openapi('AuthLoginResponse')
    }
  }
}

export const AuthLoginSchema = {
  tags: ['Auth'],
  summary: 'Log in via your email and password',
  requestBody: z.union([AuthLoginEmailBodyComponent, AuthLoginUsernameBodyComponent]),
  responses: {
    '200': {
      description: 'Redirect URL', // TODO make params?
      schema: LoginRedirectResponseSchema.openapi('AuthLoginResponse')
    }
  }
}

export const AuthLogoutSchema = {
  tags: ['Auth'],
  summary: 'Log out',
  responses: {
    '204': {
      description: 'No content'
    }
  }
}

export const AuthLoginOauthSchema = {
  tags: ['Auth'],
  summary: 'Log in via OAuth',
  parameters: {
    provider: Query(z.string(), {
      description: 'OAuth code'
    }),
    redirect_url: Query(z.string(), {
      description: 'OAuth state',
      required: false
    })
  },
  responses: {
    '200': {
      description: 'OAuth login URL',
      schema: OauthLoginResponseComponent
    },
    '302': {
      description: 'Redirect to Request URL'
    }
  }
}

export const AuthLoginOauthCallbackSchema = {
  tags: ['Auth'],
  summary: 'Log in via OAuth callback',
  parameters: {
    code: Query(z.string(), {
      description: 'OAuth code'
    }),
    state: Query(z.string(), {
      description: 'OAuth state'
    })
  },
  responses: {
    '200': {
      description: 'Successful OAuth login - session',
      schema: SessionComponent
    },
    '400': {
      description: 'Bad Request',
      schema: ApiErrorResponseComponent
    },
    '500': {
      description: 'Internal Server Error',
      schema: ApiErrorResponseComponent
    }
  }
}

export const AuthVerifyTokenRequestSchema = {
  tags: ['Auth'],
  summary: 'Request a verification token',
  parameters: {
    email: Query(Str, {
      description: 'Email address'
    })
  }
}

export const AuthVerifyEmailSchema = {
  tags: ['Auth'],
  summary: 'Verify email',
  parameters: {
    token: Query(Str, {
      description: 'Verification token'
    })
  },
  responses: {
    '200': {
      description: 'Successful email verification',
      schema: SessionComponent
    },
    '400': {
      description: 'Bad Request',
      schema: ApiErrorResponseComponent
    },
    '500': {
      description: 'Internal Server Error',
      schema: ApiErrorResponseComponent
    }
  }
}
