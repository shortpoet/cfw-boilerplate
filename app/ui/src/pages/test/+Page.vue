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
        <h3>On Before Render Props</h3>
        <br />
        <div v-if="todosProps">
          <ul>
            <li v-for="todo in todosProps" :key="todo.id">
              {{ todo.title }}
            </li>
          </ul>
        </div>
        <div v-else>
          <p>Loading...</p>
        </div>
      </div>

      <div flex flex-col p-3>
        <h3>Fetch from component</h3>
        <br />
        <div v-if="todos" flex flex-col p-3>
          <ul>
            <li v-for="todo in todos" :key="todo.id">
              {{ todo.title }}
            </li>
          </ul>
        </div>
        <div v-else>
          <p>Loading...</p>
        </div>
      </div>

      <div flex flex-col p-3>
        <h3>Fetch from composable</h3>
        <br />
        <div v-if="todosFetch" flex flex-col p-3>
          <ul>
            <li v-for="todo in todosFetch" :key="todo.id">
              {{ todo.title }}
            </li>
          </ul>
        </div>
        <div v-else>
          <p>Loading...</p>
        </div>
      </div>

      <div flex flex-col p-3>
        <h3>Fetch from composable on Before Render</h3>
        <br />
        <div v-if="todosFetchProps" flex flex-col p-3>
          <ul>
            <li v-for="todo in todosFetchProps" :key="todo.id">
              {{ todo.title }}
            </li>
          </ul>
        </div>
        <div v-else>
          <p>Loading...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Todo, getTodos } from './todos'
// @ts-expect-error figure out why this works but is linted
import IconDataSuccess from '~icons/carbon/rocket'
onInfoFlash({
  title: 'Info Greeting',
  text: 'Greetings earthling',
  duration: 5000,
  icon: markRaw(IconDataSuccess),
  show: true
})

defineProps({
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
</script>
