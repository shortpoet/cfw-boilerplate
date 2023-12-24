<template>
  <div>
    <FlashMessage />
    <ListViewer
      :isPending="isPending"
      :isError="isError"
      :isFetching="isFetching"
      :items="dataItems"
      :error="error"
      :refetch="refetch"
    />
    <Pagination :items="pageItems" @changePage="onChangePage" />
    <!-- <Pagination v-model:page="currentPage" :page-count="totalItems" /> -->
  </div>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { TaskListResponse } from '../../../models/TaskListResponse'
import { TasksService } from '../../../services/TasksService'
import { ApiError } from '#/ui/src'
import { ListItemLink } from '#/ui/src/components/api/ListViewer.vue'
import { Paginate } from '#/ui/src/components/pagination/paginate'

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

let totalItems = ref(0)
let currentPage = ref()
const pageSize = 10
// const noLimit = limit === 0
const startIndex = ref(0)
const endIndex = ref(pageSize)

const query = useQuery<TaskListResponse, ApiError>({
  queryKey: ['result', page, limit],
  // queryFn: () => getTaskList(page),
  queryFn: ({ queryKey }) =>
    TasksService.getTaskList({ page: queryKey[1] as number, limit: queryKey[2] as number }),
  staleTime: 1000 * 60 * 5 // 5 minutes
})
// @ts-ignore
const { isPending, isError, isFetching, data, error, refetch, suspense } = query
let pageItems: Ref<ListItemLink[]> = ref([])
// let dataItems: Ref<ListItemLink[]> = ref([])
// await suspense()
// onServerPrefetch(suspense)
if (data.value) {
  totalItems.value = data.value?.tasks.length
  // const pages = Math.ceil(totalItems.value / (noLimit ? pageSize : limit))
  pageItems.value = Array.from({ length: totalItems.value }, (_, i) => ({
    id: i + 1,
    href: `/task/${i + 1}`,
    name: `Page ${i + 1}`
  }))
}
const dataItems = computed(() => {
  return data.value?.tasks
    .map((task, i) => {
      return {
        id: i,
        href: `/task/${i}`,
        name: task.name
      }
    })
    .slice(startIndex.value, endIndex.value)
})
const onChangePage = (pager: Paginate) => {
  currentPage.value = pager.currentPage
  startIndex.value = pager.startIndex
  endIndex.value = pager.endIndex
  // console.log(`[ui] [Task] [onChangePage] [page] ::`)
  // console.log(pager)
  // console.log(`[ui] [Task] [onChangePage] [currentPage] ::`)
  // console.log(currentPage.value)
  // query.refetch()
}
</script>
