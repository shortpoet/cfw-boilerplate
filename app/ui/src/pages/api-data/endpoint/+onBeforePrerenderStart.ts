import { OnBeforePrerenderStartAsync } from 'vike/types'
import { ROUTE_MAPPING } from '../../routeMapping'

// https://vike.dev/onBeforePrerenderStart
export { onBeforePrerenderStart }

const onBeforePrerenderStart: OnBeforePrerenderStartAsync =
  async (): ReturnType<OnBeforePrerenderStartAsync> => {
    const endpoints = Object.values(ROUTE_MAPPING)
    const out = [
      ...endpoints.map((ep) => {
        return {
          url: ep.path,
          // Note that we can also provide the `pageContext` of other pages.
          // This means that Vike will not call any
          // `onBeforeRender()` hook and the Star Wars API will be called
          // only once (in this `prerender()` hook).
          pageContext: {
            title: ep.title
          }
        }
      })
    ]
    // console.log(`[ui] [api-data] [onBeforePrerenderStart] out`);
    // console.log(out);
    return out
  }
