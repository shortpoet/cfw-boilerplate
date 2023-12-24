<template>
  <div class="page-container">
    <FlashMessage />
    <ApiViewerFetch :title="title" :data="data" :loading="isPending" :error="error" />
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

const { taskId } = defineProps({
  taskId: {
    type: Number,
    required: true
  }
})

const query = useQuery<TaskListResponse>({
  queryKey: ['result', taskId],
  // queryFn: () => getTaskList(page),
  queryFn: ({ queryKey }) => TasksService.getTaskFetch(queryKey[1] as number),
})
// @ts-ignore
const { isPending, isError, isFetching, data, error, refetch, suspense } = query
// await suspense()
onServerPrefetch(suspense)
</script>
