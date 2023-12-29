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
export interface ApiError {
  message: string
  type: string
  code: number
  stack?: string
  cause?: unknown
}

export interface ApiErrorResponse {
  success: boolean
  error: ApiError
}
