import {
  AuthLoginBodySchema,
  AuthLoginEmailBodySchema,
  AuthLoginUsernameBodySchema,
  AuthRegisterBodySchema,
  OauthLoginResponseSchema,
  SessionSchema,
  UserSchema
} from '#/types'
import { z } from 'zod'

export const UserComponent = UserSchema.openapi('User')
export const SessionComponent = SessionSchema.openapi('Session')
export const AuthRegisterBodyComponent = AuthRegisterBodySchema.openapi('AuthRegisterBody')

export const AuthLoginEmailBodyComponent = AuthLoginEmailBodySchema.openapi('AuthLoginEmailBody')

export const AuthLoginUsernameBodyComponent =
  AuthLoginUsernameBodySchema.openapi('AuthLoginUsernameBody')

export const AuthLoginBodyComponent = AuthLoginBodySchema.openapi('AuthLoginBody')

export const OauthLoginResponseComponent = OauthLoginResponseSchema.openapi('OauthLoginResponse')
export type OauthLoginResponseType = z.infer<typeof OauthLoginResponseComponent>
