<template>
  <div>
    <FlashMessage />
    <ListViewer
      :isPending="isPending"
      :isError="isError"
      :isFetching="isFetching"
      :items="items"
      :error="error"
      :refetch="refetch"
    >
    </ListViewer>
  </div>
</template>

<style scoped>
.update {
  font-weight: bold;
  color: green;
}
</style>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { TaskListResponse } from '../../../models/TaskListResponse'
import { TasksService } from '../../../services/TasksService'
import ListViewer, { ListItems, ListItem } from '#/ui/src/components/base/ListViewer.vue'
import { ApiError } from '#/ui/src'

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
// console.log(`[task] [index] [Page]`)
// console.log(`page: ${page}`)
// console.log(`limit: ${limit}`)

const query = useQuery<TaskListResponse, ApiError>({
  queryKey: ['result', page, limit],
  // queryFn: () => getTaskList(page),
  queryFn: ({ queryKey }) =>
    TasksService.getTaskList({ page: queryKey[1] as number, limit: queryKey[2] as number })
})
// @ts-ignore
const { isPending, isError, isFetching, data, error, refetch, suspense } = query
let items: Ref<ListItems<ListItem>> = ref([]) as unknown as Ref<ListItems<ListItem>>
// await suspense()
// onServerPrefetch(suspense)
if (data.value) {
  const length = data.value?.tasks.length
  console.log(data.value)
  console.log(length)

  const pages = Math.ceil(length / limit === 0 ? 1 : limit)
  console.log('pages', pages)
  items.value.items = Array.from({ length: pages }, (_, i) => {
    return {
      id: i + 1
    }
  })
  console.log(items.value.items)

  // items.value.items = data.value?.tasks.map((task) => {
  //   return {
  //     id: task.name,
  //   }
  // })
}
</script>
