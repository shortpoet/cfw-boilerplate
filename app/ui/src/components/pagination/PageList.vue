<template>
  <nav class="pagination">
    <div v-if="isPending" class="update">Loading...</div>
    <div v-else-if="isError">
      <div>An error has occurred:</div>
      <div>message: {{ error?.message }}</div>
      <div>name: {{ error?.body }}</div>
    </div>
    <div v-else>
      <button @click="selectPage(currentPage - 1)" :disabled="currentPage === 1">Previous</button>
      <div class="page-numbers">
        <span v-if="showEllipsisStart" class="ellipsis">...</span>
        <span
          v-for="pageNumber in visiblePages"
          :key="pageNumber"
          :class="{ active: pageNumber === currentPage }"
        >
          <button @click="selectPage(pageNumber)">{{ pageNumber }}</button>
        </span>
        <span v-if="showEllipsisEnd" class="ellipsis">...</span>
      </div>
      <button @click="selectPage(currentPage + 1)" :disabled="currentPage === totalPages">
        Next
      </button>
    </div>
  </nav>
</template>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
}

.page-numbers {
  display: flex;
}

.page-numbers button {
  margin: 0 4px;
  padding: 4px 8px;
}

.page-numbers .ellipsis {
  margin: 0 4px;
}
</style>

<!-- https://stackoverflow.com/questions/70542599/how-to-type-a-generic-component-in-vue-3s-script-setup -->
<!-- <script setup lang="ts" generic="T extends string | number, U extends Item">
import type { Item } from './types'
defineProps<{
  id: T
  list: U[]
}>()
</script> -->

<script setup lang="ts" generic="T extends ListItemLink">
import { PropType } from 'vue'
import { ApiError } from '../..'

export type ListItemLink = {
  id: string | number
  href: string
  name: string
}

const props = defineProps({
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
  items: {
    required: true,
    type: Array as PropType<ListItemLink[]>
  },
  error: {
    type: [ApiError, null] as PropType<ApiError | null>,
    required: true
  },
  refetch: {
    type: Function,
    required: true
  }
})
const visiblePages = ref([1, 2, 3, 4, 5]) // Set initial visible pages here
const totalPages = ref(props.items.length)
// Handle page selection logic here
const selectPage = (pageNumber: number) => {
  // Update the visiblePages array based on the selected page number
  const startIndex = pageNumber - 2 > 0 ? pageNumber - 2 : 1
  const endIndex = startIndex + 4 < totalPages.value ? startIndex + 4 : totalPages.value
  visiblePages.value = Array.from(
    { length: endIndex - startIndex + 1 },
    (_, index) => startIndex + index
  )
  // Perform any other logic related to page selection here
}
const currentPage = computed(() => visiblePages.value[0])
const showEllipsisStart = computed(() => visiblePages.value[0] !== 1)
const showEllipsisEnd = computed(
  () => visiblePages.value[visiblePages.value.length - 1] !== totalPages.value
)
// console.log(`[ListViewer] LOAD`)
// console.log(props.items)
// console.log('is error', props.isError)
// console.log('is pending', props.isPending)
// console.log('is fetching', props.isFetching)
// console.log('error', props.error)
// console.log('refetch', props.refetch)
if (props.isError) {
  throw 'This will trigger the upstream error boundary.'
}
</script>
