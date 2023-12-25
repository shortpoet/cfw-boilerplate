export { getEndpoints, Endpoint, PATH_MAPPING }

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
  // return path.replace(/\{([^\}]+)\}/g, ':$1');
  // console.log(`[ui] [api-data] [formatPath] path: ${path}`);
  return path
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
  let { dataLoading, error, data } = {
    dataLoading: ref(false),
    error: ref(),
    data: ref<DiscoveryEndpoint>()
  }
  const opts = {} as RequestConfig

  try {
    ;({ dataLoading, error, data } = await useFetch<DiscoveryEndpoint>('api/openapi.json', opts))
    const { text } = data.value || { text: '{}' }
    // console.log(`[ui] [api-data] [onBeforePrerenderStart] endpoints`);
    const openApi = JSON.parse(text) as OpenApi
    const e = Object.keys(openApi.paths)
      .filter((path) => !path.match(/[\*\{]/))
      .reverse()
    endpoints = e.map((path) => {
      return {
        path,
        title:
          openApi.paths[path].get?.summary || openApi.paths[path].post?.summary || formatPath(path)
      }
    })
    // console.log(endpoints);
  } catch (error) {}
  return endpoints
}
