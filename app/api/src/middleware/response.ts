const FILE_LOG_LEVEL = 'debug'
import { JsonData } from '../../../types'

interface Headers {
  [key: string]: string
}
enum ResText {
  OK = 'OK',
  CREATED = 'Created',
  UNAUTHORIZED = 'Unauthorized',
  NOT_FOUND = 'Resource Not Found',
  BAD_REQUEST = 'Bad Request',
  SERVER_ERROR = 'Server Error'
}
interface ApiError {
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

export const getBaseUrl = (env: Env) => {
  return {
    baseUrlApi:
      env.NODE_ENV === 'development' || env.NODE_ENV === 'staging'
        ? `http://${env.API_HOST}:${env.VITE_PORT_API}`
        : `https://${env.API_HOST}`,
    baseUrlApp:
      env.NODE_ENV === 'development' || env.NODE_ENV === 'staging'
        ? `http://${env.HOST}:${env.VITE_PORT}`
        : `https://${env.HOST}`
  }
}

export const remapHeaders = (res: Response) => {
  const headers = new Headers(res.headers)
  Object.entries(headers).map(([key, val]) => res.headers.set(key, val))
  return res
}

export const setHeaders = (
  res: Response,
  headers: Response['headers'] | Record<string, string>
) => {
  Object.entries(headers).map(([key, val]) => res.headers.set(key, val))
  return res
}

export const remapResponseProperties = (res: Response, properties: (keyof ResponseInit)[]) => {
  const init: ResponseInit = {}
  properties.map((prop) => (init[prop] = res[prop]))
  return init
}

export const initResponse = (res: Response | undefined) => {
  let init: ResponseInit = {}
  if (res) {
    init = remapResponseProperties(res, ['cf'])
    res = remapHeaders(res)
    res = setHeaders(res, {
      'content-type': 'application/json'
    })
    init.headers = res.headers
  }
  return init
}

const createErr = (type: string, code: number, err: Error | unknown) => ({
  success: false,
  error: {
    message: err instanceof Error ? err.message : `${err}`,
    type: type,
    code: code,
    stack: err instanceof Error ? err.stack : undefined,
    cause: err instanceof Error ? err.cause : undefined
  }
})

const formatErr = (err: ApiErrorResponse) => JSON.stringify(err, null, 2)

export const notFoundResponse = (msg?: string, err?: Error | unknown, res?: Response) => {
  const newErr = err instanceof Error ? err : new Error(`${msg}` || ResText.NOT_FOUND)
  msg = msg ? `${ResText.NOT_FOUND} - ${msg}` : ResText.NOT_FOUND
  const init = {
    ...res,
    status: 404,
    statusText: newErr.message || ResText.NOT_FOUND
  } as ResponseInit
  const body = formatErr(createErr(msg, 404, newErr))
  return new Response(body, init)
}

export const badResponse = (msg?: string, err?: Error | unknown, res?: Response) => {
  const newErr = err instanceof Error ? err : new Error(`${msg}` || ResText.NOT_FOUND)
  msg = msg ? `${ResText.BAD_REQUEST} - ${msg}` : ResText.BAD_REQUEST
  const init = {
    ...res,
    status: 400,
    statusText: newErr.message || ResText.BAD_REQUEST
  } as ResponseInit
  // console.log(`[api] [badResponse] -> init: ${JSON.stringify(init, null, 2)}`)
  // console.log(`[api] [badResponse] -> newerr: ${JSON.stringify(newErr, null, 2)}`)
  // console.log(newErr)
  const body = formatErr(createErr(msg, 400, newErr))
  // console.log(`[api] [badResponse] -> body: ${JSON.stringify(body, null, 2)}`)
  return new Response(body, init)
}

export const serverErrorResponse = (msg?: string, err?: Error | unknown, res?: Response) => {
  const newErr = err instanceof Error ? err : new Error(`${msg}` || ResText.NOT_FOUND)
  msg = msg ? `${ResText.SERVER_ERROR} - ${msg}` : ResText.SERVER_ERROR
  const init = {
    ...res,
    status: 500,
    statusText: newErr.message || ResText.SERVER_ERROR
  } as ResponseInit
  const body = formatErr(createErr(msg, 500, newErr))
  return new Response(body, init)
}

export const jsonOkResponse = (data: any, res?: Response) => {
  return okResponse(JSON.stringify(data, null, 2), res)
}

export const jsonCreatedResponse = (data: any, res?: Response) => {
  return createdResponse(JSON.stringify(data), res)
}

export const okResponse = (data?: string, res?: Response) => {
  const init = initResponse(res)
  return new Response(data || '{}', { ...init, status: 200, statusText: ResText.OK })
}

export const createdResponse = (data?: string, res?: Response) => {
  const init = initResponse(res)
  return new Response(data, { ...init, status: 201, statusText: ResText.CREATED })
}

export const unauthorizedResponse = (data?: string, res?: Response, status = 401) => {
  const init = initResponse(res)
  return new Response(data, {
    ...init,
    status,
    statusText: ResText.UNAUTHORIZED
  })
}
