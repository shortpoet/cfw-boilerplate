import { z } from 'zod'

export const ApiErrorResponseComponent = z
  .object({
    success: z.boolean(),
    error: z.object({
      message: z.string(),
      type: z.string(),
      code: z.number(),
      stack: z.string().optional(),
      cause: z.string().optional()
    })
  })
  .openapi('ApiErrorResponse')
export type ApiErrorResponseComponentType = z.infer<typeof ApiErrorResponseComponent>
