export { getEndpoints, Endpoint }

import fs from 'node:fs'

import { RequestConfig } from '#/types'

type DiscoveryEndpoint = {
  text: string
}
type OpenApi = {
  openapi: string
  info: {
    title: string
    version: string
    description?: string
  }
  components: {
    schmemas: Record<string, any>
    parameters: Record<string, any>
  }
  paths: Record<string, any>
}

type Endpoint = {
  path: string
  title: string
  route?: string
}

const formatPath = (path: string) => {
  console.log(`[ui] [api-data] [formatPath] path: ${path}`)
  const parts = path.replace(/^\/api/g, '/api-data').split('/')
  return parts.length > 3
    ? `/${parts[1]}/${parts[2]}-${parts.slice(3).join('-')}`
    : `/${parts[1]}/${parts[2]}`
}
const formatTitle = (title: string) => {
  // return title.replace(/\{([^\}]+)\}/g, ':$1');
  return title
    .replace(/\//g, ' ')
    .replace(/api/g, '')
    .trim()
    .split(' ')
    .map((p) => p[0].toUpperCase() + p.slice(1))
    .join(' ')
}

const PATH_MAPPING = {
  '/api-data/hello': { route: 'api/hello', options: {} },
  '/api-data/debug': { route: 'api/health/debug', options: {} },
  '/api-data/health': { route: 'api/health/check', options: {} },
  '/api-data/healthR': { route: 'api/health/check-root', options: {} },
  '/api-data/healthE': { route: 'api/health/check2', options: {} },
  '/api-data/json-file': { route: 'api/json-data', options: {} },
  '/api-data/tasks': { route: 'api/task/tasks', options: {} },
  '/api-data/users': { route: 'api/auth/user/all', options: {} }
} as Record<string, any>

const getEndpoints = async () => {
  let endpoints: Endpoint[] = Object.keys(PATH_MAPPING).map((path) => {
    return {
      path,
      title: formatPath(path)
    }
  })
  if (process.env.NODE_ENV !== 'development') return endpoints
  const opts = {} as RequestConfig

  try {
    const openApi = (await import('#/api/openapi.json')).default as unknown as OpenApi
    // console.log(`[ui] [api-data] [onBeforePrerenderStart] endpoints`);

    const e = Object.keys(openApi.paths)
      .filter((path) => !path.match(/[\*\{]/))
      .reverse()
    endpoints = e.map((path) => {
      return {
        path: formatPath(path),
        title:
          openApi.paths[path].get?.summary ||
          openApi.paths[path].post?.summary ||
          formatTitle(path),
        route: path.replace(/^\//, '')
      }
    })
    console.log(endpoints)
  } catch (error) {}
  return endpoints
}
