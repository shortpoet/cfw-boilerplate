import { OpenAPI } from '..'

const { urlBaseApi } = useBaseUrl()

export const initOpenAPI = (
  {
    isDev,
    token,
    username,
    password
  }: { isDev: boolean; token?: string; username?: string; password?: string } = {
    isDev: false
  }
) => {
  OpenAPI.BASE = urlBaseApi
  OpenAPI.TOKEN = token
  OpenAPI.USERNAME = username
  OpenAPI.PASSWORD = password
  OpenAPI.HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Credentials': 'true',
    Accept: 'application/json'
  }
  // cloudflare no likey
  // local cookie likey
  OpenAPI.WITH_CREDENTIALS = isDev
}
