export { Route, OpenApi, RouteMapping }

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

type Route = {
  path: string
  title: string
  endpoint: string
}

type RouteMapping = {
  [key: string]: Route
}
