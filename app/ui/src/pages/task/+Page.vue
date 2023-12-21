<template>
  <div v-if="isLoading">
    Loading...
  </div>
  <div v-else-if="result">
    <ul>
      <li v-for="task in result.tasks" :key="task.name">
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
  </div>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { TaskListResponse } from '../../models/TaskListResponse'
import { TasksService } from '../../services/TasksService'
import { getTaskList } from './+onBeforeRender';

const { page } = defineProps({
  page: {
    type: Number,
    required: true,
  },
})

const query = useQuery<TaskListResponse>({
  queryKey: ["result", page],
  // queryFn: () => getTaskList(page),
  queryFn: ({ queryKey }) => TasksService.getTaskList({ page: queryKey[1] as number }).then((response) => response),
});
// console.log(`[TaskPage] query:`)
// for (const [key, value] of Object.entries(query)) {
//   console.log(`${key}: ${value.value}`);
// }
const { data, isLoading, refetch } = query

console.log(`[TaskPage] page: ${page}`)
console.log(`[TaskPage] data.value:`)
const result = data.value?.result
console.log(`[TaskPage] result:`)
console.log(result)

console.log(`[TaskPage] query:`)
// console.log(query)



</script>
