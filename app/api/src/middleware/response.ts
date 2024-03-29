const FILE_LOG_LEVEL = 'debug'
import { JsonData, ResText } from '#/types'
import { createErr, formatErr } from '#/utils'

export const getBaseUrl = (env: Env) => {
  return {
    baseUrlApi: `http,s://${env.API_HOST}`,
    // env.NODE_ENV === 'development' || env.NODE_ENV === 'staging'
    //   ? `http://${env.API_HOST}:${env.VITE_PORT_API}`
    //   : `https://${env.API_HOST}`,
    baseUrlApp: `https://${env.HOST}`
    // env.NODE_ENV === 'development' || env.NODE_ENV === 'staging'
    //   ? `http://${env.HOST}:${env.VITE_PORT}`
    //   : `https://${env.HOST}`
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

export const notFoundResponse = (msg?: string, err?: Error | unknown, res?: Response) => {
  const newErr = err instanceof Error ? err : new Error(`${msg}` || ResText.NOT_FOUND)
  msg = msg ? `${ResText.NOT_FOUND} - ${msg}` : ResText.NOT_FOUND
  const init = {
    ...res,
    status: 404,
    statusText: typeof newErr.message === 'string' ? newErr.message : ResText.NOT_FOUND
  } as ResponseInit
  const body = formatErr(createErr(msg, 404, newErr))
  return new Response(body, init)
}

export const badResponse = (msg?: string, err?: Error | unknown, res?: Response) => {
  console.log(`[api] [badResponse] -> msg: ${msg}`)
  const newErr = err instanceof Error ? err : new Error(`${msg}` || ResText.NOT_FOUND)
  msg = msg ? `${ResText.BAD_REQUEST} - ${msg}` : ResText.BAD_REQUEST
  // console.log(`[api] [badResponse] -> msg: ${msg}`)
  // console.log(`[api] [badResponse] -> newErr: ${newErr}`)
  // console.log(`[api] [badResponse] -> newErr.message: ${newErr.message}`)
  // console.log(`[api] [badResponse] -> newErr.message: ${typeof newErr.message}`)
  const statusText = ResText.BAD_REQUEST
  // zod error being mangled from obj to string then becomes invalid statusText
  // const statusText = typeof newErr.message === 'string' ? `${newErr.message}` : ResText.BAD_REQUEST
  console.log(`[api] [badResponse] -> statusText: ${statusText}`)
  const init = {
    ...res,
    status: 400,
    statusText
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
    statusText: ResText.SERVER_ERROR
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
