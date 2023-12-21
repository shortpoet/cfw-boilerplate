<template>
  <div v-if="isPending" class="update">Loading...</div>
  <div v-else-if="isError">An error has occurred: {{ error }}</div>
  <div v-else-if="data">
    <ul>
      <li v-for="task in data.tasks" :key="task.name">
        <div>name: {{ task.name }}</div>
        <div>desc: {{ task.description }}</div>
        <div>completed: {{ task.completed }}</div>
        <div>due date: {{ task.due_date }}</div>
        <div>slug: {{ task.slug }}</div>
      </li>
    </ul>
    <br>
    <button @click="refetch()">
      Refetch
    </button>
    <br>
    <div v-if="isFetching" class="update">Background Updating...</div>
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

const { page } = defineProps({
  page: {
    type: Number,
    required: true,
  },
})

const query = useQuery<TaskListResponse>({
  queryKey: ["result", page],
  // queryFn: () => getTaskList(page),
  queryFn: ({ queryKey }) => TasksService.getTaskList({ page: queryKey[1] as number }),
});
const { isPending, isError, isFetching, data, error, refetch, suspense } = query
await suspense()

</script>
