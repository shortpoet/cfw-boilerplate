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

const { page } = defineProps(['page'])

const { data, isLoading, refetch } = useQuery<TaskListResponse>({
  queryKey: ["result", page],
  queryFn: () =>
    TasksService.getTaskList({ page }),
});

console.log(data.value)
const result = data.value?.result
console.log(result)

const getTaskList = async () => {
  const response = await fetch('http://localhost:3000/api/task/tasks?page=2');
  const data = await response.json();
  console.log(`data: ${data}`) // data: [object Object]
  return data;
}



</script>
