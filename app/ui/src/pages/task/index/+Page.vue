<template>
  <div>
    <FlashMessage />
    <h1 bg-teal-700 rounded>Task List</h1>
    <ListViewer
      :isPending="isPending"
      :isError="isError"
      :isFetching="isFetching"
      :items="listItems"
      :error="error"
      :refetch="refetch"
    />
    <Pagination :items="dataItems" @changePage="onChangePage" />
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

// let totalItems = ref(0)
// const pages = Math.ceil(totalItems.value / (noLimit ? pageSize : limit))

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

const dataItems: ComputedRef<ListItemLink[] | undefined> = computed(
  () =>
    data.value?.tasks.map((task) => {
      const id = task.id
      return {
        id,
        href: `/task/${id}`,
        name: task.name
      }
    })
)
const listItems = computed(() => dataItems.value?.slice(startIndex.value, endIndex.value))
const onChangePage = (pager: Paginate) => {
  currentPage.value = pager.currentPage
  startIndex.value = pager.startIndex
  endIndex.value = pager.endIndex
}
</script>
