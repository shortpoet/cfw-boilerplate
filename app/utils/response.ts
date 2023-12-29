import { ApiErrorResponse } from '#/types'

export const createErr = (type: string, code: number, err: Error | unknown) => ({
  success: false,
  error: {
    message: err instanceof Error ? err.message : `${err}`,
    type: type,
    code: code,
    stack: err instanceof Error ? err.stack : undefined,
    cause: type
    // compiler error in fetch.ts
    // cause: err instanceof Error ? err.cause : type
  }
})

export const formatErr = (err: ApiErrorResponse) => JSON.stringify(err, null, 2)
