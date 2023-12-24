<template>
  <div>TEST</div>
  <!-- <ListViewer :isPending="isPending" :isError="isError" :isFetching="isFetching" :items="items" :error="error"
    :refetch="refetch">
  </ListViewer> -->
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

const { page } = defineProps({
  page: {
    type: Number,
    required: true
  }
})

const query = useQuery<TaskListResponse>({
  queryKey: ['result', page],
  // queryFn: () => getTaskList(page),
  queryFn: ({ queryKey }) => TasksService.getTaskList({ page: queryKey[1] as number })
})
// @ts-ignore
const { isPending, isError, isFetching, data, error, refetch, suspense } = query
// await suspense()
onServerPrefetch(suspense)
</script>
