import { OpenAPI } from '..'

const { urlBaseApi } = useBaseUrl()

export const initOpenAPI = ({
  token,
  username,
  password
}: { token?: string; username?: string; password?: string } = {}) => {
  OpenAPI.BASE = urlBaseApi
  OpenAPI.TOKEN = token
  OpenAPI.USERNAME = username
  OpenAPI.PASSWORD = password
  OpenAPI.HEADERS = {
    'Content-Type': 'application/json',
    // 'Access-Control-Allow-Credentials': 'true',
    Accept: 'application/json'
  }
  OpenAPI.WITH_CREDENTIALS = false
}
