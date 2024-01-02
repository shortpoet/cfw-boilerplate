import { z } from 'zod'

export const ApiErrorSchema = z.object({
  message: z.string(),
  type: z.string(),
  code: z.number(),
  stack: z.string().optional(),
  cause: z.string().optional()
})
export type ApiError = z.infer<typeof ApiErrorSchema>

export interface ListOptions {
  indexKey?: string
  limit?: number
  cursor?: string
}

export interface ListOptionsRequest extends Request {
  listOptions: ListOptions
}

export interface JsonData {
  [key: string]: unknown
}
