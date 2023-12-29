import { Route, OpenApi } from '#/types'

export { getRoutes }

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

const getRoutes: () => Promise<Route[]> = async () => {
  const openApi = (await import('#/api/openapi.json')).default as unknown as OpenApi
  // console.log(`[ui] [api-data] [onBeforePrerenderStart] routes`);
  const routes: Route[] = Object.keys(openApi.paths)
    .filter((path) => !path.match(/[\*\{]/))
    .reverse()
    .map((path) => {
      return {
        path: formatPath(path),
        title:
          openApi.paths[path].get?.summary ||
          openApi.paths[path].post?.summary ||
          formatTitle(path),
        endpoint: path.replace(/^\//, '')
      }
    })
  console.log(routes)
  return routes
}
