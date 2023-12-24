<template>
  <div>
    <FlashMessage />
    <!-- <ListViewer
      :isPending="isPending"
      :isError="isError"
      :isFetching="isFetching"
      :items="items"
      :error="error"
      :refetch="refetch"
    >
    </ListViewer> -->
    <Pagination :items="items" @changePage="onChangePage" />
    <!-- <Pagination v-model:page="currentPage" :page-count="totalPages" /> -->
  </div>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { TaskListResponse } from '../../../models/TaskListResponse'
import { TasksService } from '../../../services/TasksService'
import { ApiError } from '#/ui/src'
import { ListItemLink } from '#/ui/src/components/api/ListViewer.vue'

const { page, limit } = defineProps({
  page: {
    type: Number,
    required: true
  },
  limit: {
    type: Number,
    required: true
  }
})

let totalPages = ref(0)
let currentPage = ref(0)

const query = useQuery<TaskListResponse, ApiError>({
  queryKey: ['result', page, limit],
  // queryFn: () => getTaskList(page),
  queryFn: ({ queryKey }) =>
    TasksService.getTaskList({ page: queryKey[1] as number, limit: queryKey[2] as number }),
  staleTime: 1000 * 60 * 5 // 5 minutes
})
// @ts-ignore
const { isPending, isError, isFetching, data, error, refetch, suspense } = query
let items: Ref<ListItemLink[]> = ref([])
// await suspense()
// onServerPrefetch(suspense)
if (data.value) {
  totalPages.value = data.value?.tasks.length
  const pageSize = 10
  const noLimit = limit === 0
  const pages = Math.ceil(totalPages.value / (noLimit ? pageSize : limit))
  items.value = Array.from({ length: pages }, (_, i) => {
    return {
      id: i + 1,
      href: `/task/${i + 1}`,
      name: `Page ${i + 1}`
    }
  })
}
const onChangePage = (page: number) => {
  currentPage.value = page
  console.log(`[ui] [Task] [onChangePage] [page] :: ${page}`)
  console.log(`[ui] [Task] [onChangePage] [currentPage] :: ${currentPage.value}`)
  // query.refetch()
}
</script>
