<template>
  <div class="page-container">
    <FlashMessage />
    <ApiViewerQuery :title="title" :data="data" :isPending="isPending" :isError="isError" :isFetching="isFetching"
      :error="error" :refetch="refetch" />
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
import { TaskResponse, TasksService } from '../../..'

const { taskId } = defineProps({
  taskId: {
    type: String,
    required: true
  }
})

const title = computed(() => `Task ${taskId}`)

const query = useQuery<TaskResponse>({
  queryKey: ['result', taskId],
  queryFn: ({ queryKey }) => TasksService.getTaskFetch({ taskId: queryKey[1] as string }),
})
// @ts-ignore
const { isPending, isError, isFetching, data, error, refetch, suspense } = query
</script>
