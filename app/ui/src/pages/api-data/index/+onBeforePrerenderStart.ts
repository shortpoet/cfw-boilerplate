// https://vike.dev/onBeforePrerenderStart
export { onBeforePrerenderStart };

import type { OnBeforePrerenderStartAsync } from 'vike/types';

import { getEndpoints } from './endpoints';

const onBeforePrerenderStart: OnBeforePrerenderStartAsync =
  async (): ReturnType<OnBeforePrerenderStartAsync> => {
    const out = [
      {
        url: '/api-data',
        // We already provide `pageContext` here so that Vike
        // will *not* have to call the `onBeforeRender()` hook defined
        // above in this file.
        pageContext: {
          pageProps: {
            endpoints: await getEndpoints(),
          },
          title: 'API Data',
        },
      },
      // ...endpoints.map((ep) => {
      //   const url = `/star-wars/${ep}`
      //   return {
      //     url,
      //     // Note that we can also provide the `pageContext` of other pages.
      //     // This means that Vike will not call any
      //     // `onBeforeRender()` hook and the Star Wars API will be called
      //     // only once (in this `prerender()` hook).
      //     pageContext: {
      //       pageProps: {
      //         movie: filterMovieData(movie)
      //       },
      //       title: movie.title
      //     }
      //   }
      // })
    ];
    // console.log(`[ui] [api-data] [onBeforePrerenderStart] out`);
    // console.log(out);
    return out;
  };
