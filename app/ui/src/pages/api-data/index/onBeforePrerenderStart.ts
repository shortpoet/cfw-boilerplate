import type { OnBeforePrerenderStartAsync } from 'vike/types'

const onBeforePrerenderStart: OnBeforePrerenderStartAsync<Data> = async (): ReturnType<
  OnBeforePrerenderStartAsync<Data>
> => {
  const movies = await fetchStarWarsMovies()

  return [
    {
      url: '/star-wars',
      // We already provide `pageContext` here so that Vike
      // will *not* have to call the `data()` hook defined
      // above in this file.
      pageContext: {
        data: {
          movies: filterMoviesData(movies),
          title: getTitle(movies)
        }
      }
    }
  ]
}
