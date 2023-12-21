<template>
  <div v-if="isPending" class="update">Loading...</div>
  <div v-else-if="isError">An error has occurred: {{ error }}</div>
  <div v-else-if="data">
    <nav>
      <nav-item v-for="task in data.tasks" :key="task.name">
        <Link :href="`${task.name}`"> {{ task.name }} </Link>
      </nav-item>
    </nav>
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
