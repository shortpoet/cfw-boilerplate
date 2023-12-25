<template>
  <div id="test-page-out">
    <div>
      <h1>Todo Test</h1>
      <ul>
        <li>
          Interactive.
          <Counter />
        </li>
      </ul>
    </div>
    <div flex flex-row justify-center>
      <div flex flex-col p-3>
        <div v-for="test in tests">
          <h3>{{ test.title }}</h3>
          <div v-if="test.data">
            <ul>
              <li v-for="item in test.data" :key="item.id">
                {{ item.title }}
              </li>
            </ul>
          </div>
          <div v-else>
            <p>Loading...</p>
          </div>
        </div>
        <br />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { Todo, getTodos } from './todos'
// @ts-expect-error figure out why this works but is linted
import IconDataSuccess from '~icons/carbon/test-tool'

const { todosProps, todosFetchProps } = defineProps({
  todosProps: {
    type: Array as () => Todo[],
    required: true
  },
  todosFetchProps: {
    type: Array as () => Todo[],
    required: true
  }
})

const { todos } = await getTodos()
const { urlBaseApi } = useBaseUrl()
const { data } = await useFetch<Todo[]>(`${urlBaseApi}/api/todos`)
const todosFetch = ref<Todo[]>(data.value)

const query = useQuery<ReturnType<typeof getTodos>>({
  queryKey: ['todos'],
  queryFn: () => getTodos()
})
// @ts-ignore
const { isPending, isError, isFetching, data: queryData, error, refetch, suspense } = query
await suspense()

onFlash({
  title: 'Info Greeting',
  text: 'Greetings earthling',
  duration: 5000,
  icon: markRaw(IconDataSuccess),
  show: true
})

const tests = ref([
  {
    title: 'Fetch from page on Before Render',
    data: todosProps
  },
  {
    title: 'Fetch from page',
    data: todos
  },
  {
    title: 'Fetch from composable',
    data: todosFetch.value
  },
  {
    title: 'Fetch from composable on Before Render',
    data: todosFetchProps
  },
  {
    title: 'Fetch from page query',
    data: (await queryData.value)?.todos
  }
])
</script>
