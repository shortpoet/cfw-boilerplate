export { getCookieAuthToken, getAuthCookies }
import { CookieSetOptions } from 'universal-cookie'
import { LUCIA_AUTH_COOKIES_SESSION_TOKEN } from '#/types'

const cookieOptions: CookieSetOptions = {
  path: '/',
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
  maxAge: 60 * 60 * 24,
  domain: 'localhost',
  sameSite: 'strict'
  // below only works in https
  // secure: true,
  // httpOnly: true,
}
const COOKIE_EXPIRY = 1000 * 60 * 60 * 24 * 30 // 30 days

const isLocalHost = (hostname: string) =>
  hostname === 'localhost' || hostname.startsWith('127.0.0.') || hostname.startsWith('192.168.')
const getCook = (hostname: string, baseUrl: string, isLocalHost: boolean) => ({
  path: '/',
  expires: new Date(Date.now() + COOKIE_EXPIRY),
  maxAge: 60 * 60 * 24,
  domain: hostname,
  sameSite: 'none' as const,
  secure: baseUrl.startsWith('https') && !isLocalHost,
  httpOnly: false
})
function parseCookie(cookie: string): { [key: string]: string } {
  return cookie
    .split(';')
    .map((c) => c.trim().split('='))
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
}

function getCookie(cookies: string, name: string): string {
  const parsed = parseCookie(cookies)
  // console.log('parsed -> ', parsed);
  return parsed[name]
}

const getCookieAuthToken = (
  request: Request | Response,
  headerName = 'cookie',
  cookieName = 'authjs.session-token'
): string | null => {
  const cookieHeader = request.headers.get(headerName)
  if (!cookieHeader) return null
  const cookie = getCookie(cookieHeader, cookieName)
  return cookie
}

interface NextAuthCookies {
  sessionToken: string | null
  csrfToken: string | null
  callbackUrl: string | null
  pkceCodeVerifier: string | null
}

const getAuthCookies = (
  cookieHeader: string,
  cookieNames = {
    sessionToken: `${LUCIA_AUTH_COOKIES_SESSION_TOKEN}`,
    csrfToken: 'authjs.csrf-token',
    callbackUrl: 'authjs.callback-url',
    pkceCodeVerifier: 'authjs.pkce.code_verifier'
  }
): NextAuthCookies => {
  const sessionToken = getCookie(cookieHeader, cookieNames.sessionToken)
  const csrfToken = getCookie(cookieHeader, cookieNames.csrfToken)
  const callbackUrl = getCookie(cookieHeader, cookieNames.callbackUrl)
  const pkceCodeVerifier = getCookie(cookieHeader, cookieNames.pkceCodeVerifier)
  return {
    sessionToken,
    csrfToken,
    callbackUrl,
    pkceCodeVerifier
  }
}
