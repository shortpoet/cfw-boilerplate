export { FetchError, UseFetchResult, useFetch, USE_FETCH_REQ_INIT }

import { Ref, UnwrapRef, ref } from 'vue'
import { escapeNestedKeys } from '#/utils'
import { RequestConfig } from '#/types'

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
  message: string
  status: number
  statusText: string
  error: any
  stack?: string
  cause?: any
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

  try {
    const response = await fetch(url)
    logger.info(`[ui] [useFetch] response:}`)
    logger.info(response)
    data.value = await response.json()
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
