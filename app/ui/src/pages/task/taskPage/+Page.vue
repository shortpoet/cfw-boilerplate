<template>
  <ListViewer :isPending="isPending" :isError="isError" :isFetching="isFetching" :items="items" :error="error"
    :refetch="refetch">
  </ListViewer>
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
import ListViewer, { ListItems, ListItem } from '#/ui/src/components/base/ListViewer.vue';

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
let items: Ref<ListItems<ListItem>> = ref([]) as unknown as Ref<ListItems<ListItem>>
// await suspense()
if (data.value) {
  items.value.items = data.value?.tasks.map((task) => {
    return {
      id: task.name,
    }
  })
}

</script>
