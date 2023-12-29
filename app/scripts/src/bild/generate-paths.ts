import { Route } from '#/types'
import { getRoutes } from '#/utils'
import fs from 'node:fs'

export const generateRouteMappingFile = async (ssrDir: string) => {
  const routes = await getRoutes() // Fetch routes using the getEndpoints function

  const routeMappingContent: Record<string, Route> = {}
  for (const route of routes) {
    routeMappingContent[route.path] = {
      endpoint: route.endpoint,
      title: route.title,
      path: route.path
    }
  }

  const routeMappingCode = `/* eslint-disable */
import type { Route, RouteMapping } from '#/types';\n\n
export const ROUTE_MAPPING: RouteMapping = ${JSON.stringify(routeMappingContent, null, 2)}`

  fs.writeFileSync(`${ssrDir}/routeMapping.ts`, routeMappingCode)
  console.log('Generated routeMapping.ts with updated content.')
}
