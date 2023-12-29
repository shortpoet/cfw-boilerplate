export { FetchError, UseFetchResult, useFetch, USE_FETCH_REQ_INIT }

import { Ref, UnwrapRef, ref } from 'vue'
import { escapeNestedKeys, formatErr, createErr } from '#/utils'
import { RequestConfig } from '#/types'
import { ApiErrorResponse } from '..'

const FILE_DEBUG = false
const FETCH_DEBUG = import.meta.env.VITE_LOG_LEVEL === 'debug' && FILE_DEBUG
const IS_SSR = true
// const IS_SSR = import.meta.env.SSR;

const USE_FETCH_REQ_INIT: RequestConfig = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    // 'Access-Control-Allow-Credentials': 'true',
    Accept: 'application/json'
  },
  redirect: 'follow',
  credentials: process.env.NODE_ENV === 'development' ? 'include' : undefined
  // referrerPolicy: 'no-referrer',
  // cache: 'no-cache',
  // credentials: 'same-origin',
  // mode: 'cors',
}

interface FetchError extends Error {
  name: string
  message: any
  status: number
  statusText: string
  error: any
  stack?: string
  cause?: any
  code?: number
}

interface UseFetchResult<T> {
  // fetchApi: () => Promise<void>
  data: Ref<UnwrapRef<T>>
  dataLoading: Ref<boolean>
  error: Ref<FetchError | undefined>
}

export const getCookie = (name: string) => {
  console.log(`[ui] [getCookie] name: ${name}`)
  console.log(`[ui] [getCookie] document.cookie: ${document.cookie}`)
  const cookie = document.cookie.split(';').find((c) => c.trim().startsWith(`${name}=`))
  if (!cookie) return
  return cookie.split('=')[1]
}

const useFetch = async <T>(
  path: string,
  options: RequestConfig = {}
): Promise<UseFetchResult<T>> => {
  const { urlBaseApi, urlBaseApp } = useBaseUrl()
  const url = path.startsWith('http') ? path : `${urlBaseApi}/${path}`
  const { logger, correlationId } = useSsrLogger()
  logger.info(`[ui] [useFetch] url: ${url}`)
  logger.info(`[ui] [useFetch] correlationId: ${correlationId}`)

  const dataLoading = ref(true)
  const error = ref<FetchError | undefined>()
  const data = ref<T>({} as T)

  const token = ref(options.token || options.session?.accessToken)
  const sessionToken = ref(options.sessionToken)

  const headers = {
    'accept-encoding': 'gzip, deflate',
    'accept-language': 'en-US,en;q=0.9',
    connection: 'keep-alive',
    'content-type': 'application/json',
    // cookie: `next-auth.session-token=${sessionToken.value}; next-auth.csrf-token=${csrfToken.value}; next-auth.callback-url=${callbackUrl.value};`,
    // cookie: `${[LUCIAAUTH_COOKIES_SESSION_TOKEN]}=${sessionToken.value};`,
    host: `${urlBaseApp}`,
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    origin: `${urlBaseApp}`,
    Authorization: `Bearer ${token.value}`,
    [X_CORRELATION_ID]: correlationId
    // "X-Ping": "pong",
  }

  const init = {
    ...USE_FETCH_REQ_INIT,
    ...options,
    headers,
    method: options.method ?? (options.body ? 'POST' : 'GET')
  }

  try {
    if (FETCH_DEBUG) {
      let logObj = escapeNestedKeys({ ...init }, ['token', 'body', 'Authorization'])
      console.info(`[ui] [useFetch] fetching data with init: -> ${JSON.stringify(logObj, null, 2)}`)
    }

    const response = await fetch(url, init)

    if (!response.ok) {
      logger.error(`[ui] [useFetch] response not ok: ${response.status}`)
      logger.error(response)
      let err: ApiErrorResponse
      try {
        err = await response.clone().json()
      } catch (error) {
        const msg = await response.clone().text()
        err = createErr(msg, 400, new Error(msg))
      }
      error.value = err.error
        ? {
            name: err.error.type,
            status: response.status,
            statusText: response.statusText,
            message: err.error.message || err.error,
            cause: err.error.cause,
            code: err.error.code,
            error: err.error
          }
        : {
            name: 'FetchError',
            status: response.status,
            statusText: response.statusText,
            message: JSON.parse(JSON.stringify(err, null, 2)),
            error: err
          }
    } else {
      const ct = response.headers.get('Content-Type')
      const jsonTypes = [
        'application/json',
        'application/x-www-form-urlencoded',
        'application/json; charset=utf-8'
      ]

      let out
      ct && jsonTypes.includes(ct)
        ? (out = await response.json())
        : (out = { text: await response.text() })

      logger.info(`[ui] [useFetch] response:}`)
      logger.debug(response)

      data.value = out
    }
  } catch (err: any) {
    logger.error(`[ui] [useFetch] error: ${err.message}`)
    console.log(err)
    let message = err.message
    try {
      message = JSON.parse(err.message)
    } catch (error) {}
    error.value = {
      name: err.name,
      message,
      status: message.status,
      statusText: message.statusText,
      error: message.error,
      stack: err.stack,
      cause: message.message
    }
  } finally {
    dataLoading.value = false
  }

  return { data, dataLoading, error }
}
