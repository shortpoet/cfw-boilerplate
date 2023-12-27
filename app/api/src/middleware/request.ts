import { badResponse } from './response'
import { ListOptions } from '#/types'
import { getD1, getSqlite } from '#/api/db'

const FILE_LOG_LEVEL = 'debug'

const fromEntries = (ent: [string, string][]) =>
  ent.reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {})

export const withDb = () => async (req: Request, _: Response, env: Env) => {
  req.logger.info(`[api] [middlware] [withDb] ->`)
  console.log(`[api] [middlware] [withDb] ->`)
  let db
  if (env.NODE_ENV === 'development') {
    console.log(`[api] [middlware] [withDb] -> env.NODE_ENV: ${env.NODE_ENV}`)
    db = await getSqlite(env)
  } else {
    console.log(`[api] [middlware] [withDb] -> env.NODE_ENV: ${env.NODE_ENV}`)
    db = await getD1(env)
  }
  // const db = env.NODE_ENV === 'development' ? await getSqlite(env) : await getD1(env)
  console.log(`[api] [middlware] [withDb] -> db: ${db}`)
  req.db = db
}

export const withQueryParams = () => async (req: Request) => {
  console.log(`[api] [middlware] [withQueryParams] ->`)
  const url = new URL(req.url)
  req.query = Object.fromEntries(url.searchParams)
  // req.query = fromEntries([...url.searchParams.entries()]);
  req.logger.info(`[api] [middlware] [withQueryParams] ->`)
  req.logger.info(req.query)
}

export const withListOptions = () => async (req: Request) => {
  console.log(`[api] [middlware] [withListOptions] ->`)
  req.logger.info(`[api] [middlware] [withListOptions] ->`)
  const { query } = req
  req.logger.info(query)
  if (!query) {
    return
  }
  const { limit, cursor, indexKey } = query

  const listOptions = {} as ListOptions
  if (limit) {
    const limitAsNumber = Number(limit)

    if (limitAsNumber !== limitAsNumber) {
      req.logger.error(`[api] [middlware] [withListOptions] [limit] query must be a number.`)
      return badResponse('[limit] query must be a number.')
    }

    if (limitAsNumber > 1000 || limitAsNumber < 0) {
      req.logger.error(
        `[api] [middlware] [withListOptions] [limit] query must be between 0 and 1000.`
      )
      return badResponse('[limit] query must be between 0 and 1000.')
    }

    listOptions.limit = limitAsNumber
  }

  if (cursor) {
    listOptions.cursor = cursor
  }
  if (indexKey) {
    listOptions.indexKey = indexKey
  }
  req.logger.info(listOptions)
  req.listOptions = listOptions
}

export const withCfSummary =
  ({ level = 'basic' } = {}) =>
  async (req: Request, env: Env) => {
    req.cf_summary = req.cf
      ? {
          longitude: req.cf.longitude,
          latitude: req.cf.latitude,
          country: req.cf.country,
          tlsVersion: req.cf.tlsVersion,
          colo: req.cf.colo,
          timezone: req.cf.timezone,
          city: req.cf.city,
          region: req.cf.region,
          regionCode: req.cf.regionCode,
          asOrganization: req.cf.asOrganization,
          postalCode: req.cf.postalCode,
          metroCode: req.cf.metroCode,
          botManagement: req.cf.botManagement
        }
      : {}
  }

export const withCfHeaders =
  ({ level = 'basic' } = {}) =>
  async (req: Request, res: Response, env: Env) => {
    console.log(`[api] [middlware] [withCfHeaders] ->`)
    const { cf } = req
    if (cf) {
      const { colo, clientTcpRtt } = cf
      if (clientTcpRtt) {
        res.headers.set('x-client-tcp-rtt', clientTcpRtt.toString())
      }
      if (colo) {
        res.headers.set('x-colo', colo.toString())
      }
    }
    res.headers.set('x-api-env', env.NODE_ENV)
  }
