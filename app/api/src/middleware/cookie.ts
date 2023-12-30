import { merge } from '#/utils'
import Cookies, { CookieChangeOptions, CookieSetOptions } from 'universal-cookie'
import sig from 'cookie-signature-subtle'
import cookie from 'cookie'
import { parseCookie } from 'lucia/utils'
import {
  LUCIA_AUTH_COOKIES_OPTIONS,
  LUCIA_AUTH_COOKIES_OPTIONS_SECURE,
  LUCIA_AUTH_COOKIES_SESSION_TOKEN
} from '#/types'
import { remapRequest } from './request'

const append = (res: Response, field: string, val: string | string[]) => {
  const prev = res.headers.get(field)
  const splitPrevious = prev && prev.split(/ *, */)
  const valArray = Array.isArray(val) ? val : [val]
  if (prev && splitPrevious) {
    valArray.unshift(...splitPrevious)
  }
  res.headers.set(field, valArray.join(', '))
}

export const withCookie = async (
  req: Request,
  res: Response,
  env: Env,
  name?: string,
  value?: string,
  options?: CookieSetOptions
) => {
  const opts = merge({}, options)
  const secret = env.NEXTAUTH_SECRET
  const signed = true
  options =
    options || env.NODE_ENV === 'production'
      ? LUCIA_AUTH_COOKIES_OPTIONS_SECURE
      : LUCIA_AUTH_COOKIES_OPTIONS

  console.log(`[api] [withCookie] [cookie] [name] -> `, name)
  console.log(`[api] [withCookie] [value] [cookie] -> `, value)
  if (!name) {
    return
  }

  if (signed && !secret) {
    throw new Error('cookieParser("secret") required for signed cookies')
  }

  let val = typeof value === 'object' ? 'j:' + JSON.stringify(value) : String(value)

  if (signed) {
    // val = 's:' + (await signCookie(val, secret))
    val = 's:' + (await sig.sign(val, secret))
  }

  if (opts.maxAge != null) {
    var maxAge = opts.maxAge - 0

    if (!isNaN(maxAge)) {
      opts.expires = new Date(Date.now() + maxAge)
      opts.maxAge = Math.floor(maxAge / 1000)
    }
  }

  if (opts.path == null) {
    opts.path = '/'
  }
  const cooked = cookie.serialize(name, String(val), opts)
  console.log(`[api] [withCookie] [cooked] -> `, cooked)
  append(res, 'Set-Cookie', cooked)
}

const unCookie = async (req: Request, res: Response, env: Env, name: string) => {
  const secret = env.NEXTAUTH_SECRET
  const cookies = parseCookie(req.headers.get('cookie') ?? '')
  const cook = cookies[name]
  req.logger.debug(`[api] [withCookie] uncook -> cookie: ${cook}`)

  // if (cook && cook.startsWith('s:')) {
  //   return (await unsignCookie(cook.replace('s:', ''), secret)) || '' // Modify this line
  // }

  return cook || ''
}

export const clearCookie = async (
  req: Request,
  res: Response,
  env: Env,
  name: string,
  options?: CookieChangeOptions
) => {
  const opts = (<any>Object).assign({}, options)
  opts.expires = new Date(1)
  await withCookie(req, res, env, name, '', opts)
}

function cookieListener(req: Request, res: Response, env: Env): void {
  if (!req.universalCookies) {
    return
  }

  req.universalCookies.addChangeListener(async (change: CookieChangeOptions) => {
    if (res.headersSent) {
      return
    }

    if (change.value === undefined) {
      await res.clearCookie(req, res, env, change.name, { name: change.name, ...change.options })
    } else {
      console.log(`[api] [middleware] [withCookies] [change] -> CHANGE CHANGE CHANGE`)
      console.log(change)
      const expressOpt = (<any>Object).assign({}, change.options)
      if (expressOpt.maxAge && change.options && change.options.maxAge) {
        // the standard for maxAge is seconds but express uses milliseconds
        expressOpt.maxAge = change.options.maxAge * 1000
      }
      await res.cookie(req, res, env, change.name, change.value, expressOpt)
    }
  })
}

export default function withCookies() {
  return async function (req: Request, res: Response, env: Env) {
    console.log(`[api] [middleware] [withCookies] ->`)
    const cookieHeader = req.headers.get('cookie') || ''
    console.log(`[api] [middleware] [withCookies] [cookieHeader] -> `, cookieHeader)
    const univCook = new Cookies(cookieHeader || '')
    req.universalCookies = univCook
    res.cookie = withCookie
    res.clearCookie = clearCookie
    res.unCookie = unCookie

    cookieListener(req, res, env)

    // try {
    //   // req = await cookieProxy(req, res, env)
    //   // remapping cookie so it is unsigned for all subsequent use
    //   if (cookieHeader) {
    //     const headers = new Headers(req.headers)
    //     headers.set('cookie', await unCookie(req, res, env, LUCIA_AUTH_COOKIES_SESSION_TOKEN))
    //     req = remapRequest(req, { headers })
    //   }

    //   // test proxy
    //   const cookieTest = req.headers.get('cookie') || ''
    //   console.log(`[api] [middleware] [withCookies] [cookieTest] -> `, cookieTest)
    //   const cookieTestAync = (await req.headers.get('cookie')) || ''
    //   console.log(`[api] [middleware] [withCookies] [cookieTestAync] -> `, cookieTestAync)

    //   cookieListener(req, res, env)
    // } catch (error) {
    //   console.log(`[api] [middleware] [withCookies] [error] -> `, error)
    // } finally {
    //   return
    // }
  }
}

const cookieProxy = async (req: Request, res: Response, env: Env) => {
  // if (cookieHeader) {
  //   const h = new Headers(req.headers)
  //   h.set('cookie', await unsignCookie(cookieHeader, env.NEXTAUTH_SECRET))
  //   req = new Request(req, { headers: h })
  // }
  const cookieHeader = req.headers.get('cookie') || ''
  if (cookieHeader) {
    req = new Proxy<Request>(req, {
      get: (target, prop) => {
        if (prop === 'headers') {
          console.log(`[api] [middleware] [withCookies] [proxy] [headers] -> `, target.headers)
          // Check if req.universalCookies exists before using it
          return new Proxy(target.headers, {
            get: (target, prop) => {
              if (prop === 'get') {
                return async (key: string) => {
                  console.log(`[api] [middleware] [withCookies] [proxy] [headers] [get] -> `, key)
                  if (key === 'cookie' && req.universalCookies) {
                    console.log(
                      `[api] [middleware] [withCookies] [proxy] [headers] [get] [cookie] -> `,
                      req.universalCookies.getAll()
                    )
                    const entries = Object.entries(req.universalCookies.getAll())
                    return await Promise.all(
                      entries.map(async ([key, value]: [string, unknown]) => {
                        // const un = await unsignCookie(String(value), env.NEXTAUTH_SECRET)
                        // console.log(
                        //   `[api] [middleware] [withCookies] [proxy] [headers] [get] [un] -> `,
                        //   un
                        // )
                        // return un
                      })
                    )
                  }
                  return Reflect.get(target, prop)
                }
              }
            }
          })
        }
        return Reflect.get(target, prop)
      }
    })
  }
  return req
}
