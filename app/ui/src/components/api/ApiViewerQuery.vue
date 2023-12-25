<template>
  <div class="page-container">
    <h1>{{ title }}</h1>

    <div v-if="isPending" class="update text-4xl">Loading...</div>
    <div v-else-if="isError">
      <div>An error has occurred:</div>
      <div>message: {{ error?.message }}</div>
      <div>name: {{ error?.body }}</div>
      <pre class="text-left">{{ error }}</pre>
    </div>
    <div v-else-if="data">
      <Link :href="`${previousPage}`" :title="'back'">
        <i class="i-carbon-page-first" inline-block />
      </Link>
      <JsonTree :data="data" />
      <br />
      <button @click="refetch()">Refetch</button>
      <br />
      <div v-if="isFetching" class="update">Background Updating...</div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
}

.update {
  font-weight: bold;
  color: green;
}
</style>

<script setup lang="ts">
import { ApiError } from '../../..'
const pageContext = usePageContext()
const { urlPathname } = pageContext
const previousPage = computed(() => urlPathname.replace(/\/[^/]+$/, ''))
// @ts-ignore suspense unused
const { title, data, isPending, isError, isFetching, error, refetch, suspense } = defineProps({
  title: {
    type: String,
    required: false
  },
  data: {
    type: Object,
    required: false
  },
  isPending: {
    type: Boolean,
    required: true
  },
  isError: {
    type: Boolean,
    required: true
  },
  isFetching: {
    type: Boolean,
    required: true
  },
  error: {
    type: [ApiError, null] as PropType<ApiError | null>,
    required: true
  },
  refetch: {
    type: Function,
    required: true
  },
  suspense: {
    type: Function,
    required: true
  }
})
// this hides the loading sequence and doesn' seem to pass the message to the error boundary but flash displays blank
// await suspense()
if (error && isError && !isPending) {
  throw 'This will trigger the upstream error boundary.'
}
</script>
