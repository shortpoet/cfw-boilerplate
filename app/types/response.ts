import { z } from 'zod'
import { ApiErrorSchema } from './api'

interface Headers {
  [key: string]: string
}
export enum ResText {
  OK = 'OK',
  CREATED = 'Created',
  UNAUTHORIZED = 'Unauthorized',
  NOT_FOUND = 'Resource Not Found',
  BAD_REQUEST = 'Bad Request',
  SERVER_ERROR = 'Server Error'
}

export const ApiErrorResponseSchema = z.object({
  success: z.boolean(),
  error: ApiErrorSchema
})
export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>
