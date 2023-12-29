<template>
  <div class="page-container">
    <FlashMessage />
    <ApiViewerFetch
      :title="title"
      :data="apiData"
      :loading="apiDataLoading"
      :error="apiDataError"
    />
    <ApiViewerFetch
      :title="`Query: ${title}`"
      :data="queryData"
      :loading="isPending"
      :error="error"
    />
  </div>
</template>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
}
</style>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { ROUTE_MAPPING } from '../../routeMapping'

// // @ts-expect-error figure out why this works but is linted
// import IconDataSuccess from '~icons/carbon/rocket'

// onInfoFlash({
//   title: 'Info Greeting',
//   text: 'Greetings earthling',
//   duration: 5000,
//   icon: markRaw(IconDataSuccess)
// })

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  apiData: {
    type: Object,
    required: false
  },
  apiDataLoading: {
    type: Boolean,
    required: true
  },
  apiDataError: {
    type: Object,
    required: false
  }
})
const pageContext = usePageContext()
const { urlPathname } = pageContext

// const opts = {
//   ...PATH_MAPPING[urlPathname].options,
//   headers: {
//     ...PATH_MAPPING[urlPathname].options.headers
//   }
// }
const opts = {
  headers: {
    'Content-Type': 'application/json'
  }
}
const { urlBaseApi } = useBaseUrl()
const endpoint = ROUTE_MAPPING[urlPathname].endpoint

const url = `${urlBaseApi}/${endpoint}`

const query = useQuery({
  queryKey: ['todos'],
  queryFn: () => fetch(url, opts).then((res) => res.json())
  // queryFn: () => useFetch(PATH_MAPPING[urlPathname].route, opts)
})
// @ts-ignore
const { isPending, isError, isFetching, data: queryData, error, refetch, suspense } = query
await suspense()

const { apiDataError } = props
if (apiDataError) {
  throw 'This will trigger the upstream error boundary.'
}
</script>
../../../../../utils/endpoints
