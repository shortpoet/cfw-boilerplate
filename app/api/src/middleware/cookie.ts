import { merge } from '#/utils'
import Cookies, { CookieChangeOptions, CookieSetOptions } from 'universal-cookie'
import sig from 'cookie-signature-subtle'
import cookie from 'cookie'

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
  console.log(`[api] [withCookie] [name] -> `, name)
  console.log(`[api] [withCookie] [value] -> `, value)
  if (!name) {
    return
  }

  if (signed && !secret) {
    throw new Error('cookieParser("secret") required for signed cookies')
  }

  let val = typeof value === 'object' ? 'j:' + JSON.stringify(value) : String(value)

  if (signed) {
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

  append(res, 'Set-Cookie', cookie.serialize(name, String(val), opts))
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

export default function withCookies() {
  return function (req: Request, res: Response, env: Env) {
    console.log(`[api] [middleware] [withCookies] ->`)
    const cookieHeader = req.headers.get('cookie') || ''
    req.universalCookies = new Cookies(cookieHeader || '')
    res.cookie = withCookie
    res.clearCookie = clearCookie

    req.universalCookies.addChangeListener(async (change: CookieChangeOptions) => {
      if (res.headersSent) {
        return
      }

      if (change.value === undefined) {
        await res.clearCookie(req, res, env, change.name, { name: change.name, ...change.options })
      } else {
        const expressOpt = (<any>Object).assign({}, change.options)
        if (expressOpt.maxAge && change.options && change.options.maxAge) {
          // the standard for maxAge is seconds but express uses milliseconds
          expressOpt.maxAge = change.options.maxAge * 1000
        }
        await res.cookie(req, res, env, change.name, change.value, expressOpt)
      }
    })
  }
}
