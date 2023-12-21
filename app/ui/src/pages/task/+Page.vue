<template>
  <div v-if="isPending" class="update">Loading...</div>
  <div v-else-if="isError">An error has occurred: {{ error }}</div>
  <div v-else-if="taskList">
    <ul>
      <li v-for="task in taskList" :key="task.name">
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
import { TaskListResponse } from '../../models/TaskListResponse'
import { TasksService } from '../../services/TasksService'
import { getTaskList } from './taskList';
import { ref } from 'vue'

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
const taskList = data.value?.tasks

// const taskList = ref<TaskListResponse['tasks']>([])
// if (data.value) {
//   const { tasks } = data.value
//   console.log('tasks', tasks)
//   for (const task of tasks) {
//     console.log('task', task)
//     taskList.value.push(task)
//   }
// }
// console.log('tasks', taskList)

</script>
