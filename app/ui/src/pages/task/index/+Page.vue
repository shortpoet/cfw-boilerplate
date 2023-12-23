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
import ListViewer, { ListItemsLink, ListItemLink } from '#/ui/src/components/base/ListViewer.vue'
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

const query = useQuery<TaskListResponse, ApiError>({
  queryKey: ['result', page, limit],
  // queryFn: () => getTaskList(page),
  queryFn: ({ queryKey }) =>
    TasksService.getTaskList({ page: queryKey[1] as number, limit: queryKey[2] as number }),
  staleTime: 1000 * 60 * 5 // 5 minutes
})
// @ts-ignore
const { isPending, isError, isFetching, data, error, refetch, suspense } = query
let items: Ref<ListItemsLink<ListItemLink>> = ref([]) as unknown as Ref<ListItemsLink<ListItemLink>>
// await suspense()
// onServerPrefetch(suspense)
if (data.value) {
  const length = data.value?.tasks.length
  const pageSize = 10
  const noLimit = limit === 0
  const pages = Math.ceil(length / (noLimit ? pageSize : limit))
  items.value.items = Array.from({ length: pages }, (_, i) => {
    return {
      id: i + 1,
      href: `/task/${i + 1}`,
      name: `Page ${i + 1}`
    }
  })
}
</script>
