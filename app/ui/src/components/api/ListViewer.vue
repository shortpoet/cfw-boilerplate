<template>
  <div v-if="isPending" class="update">Loading...</div>
  <div v-else-if="isError">
    <div>An error has occurred:</div>
    <div>message: {{ error?.message }}</div>
    <div>name: {{ error?.body }}</div>
  </div>
  <div v-else-if="items">
    <nav flex flex-col m-2>
      <div v-for="item in items" :key="item.id" flex justify-left>
        <Link :href="`${item.href}`">&rarr; {{ item.name }} </Link>
      </div>
    </nav>
    <br />
    <button @click="refetch()">Refetch</button>
    <br />
    <div v-if="isFetching" class="update">Background Updating...</div>
  </div>
</template>

<!-- https://stackoverflow.com/questions/70542599/how-to-type-a-generic-component-in-vue-3s-script-setup -->
<!-- <script setup lang="ts" generic="T extends string | number, U extends Item">
import type { Item } from './types'
defineProps<{
  id: T
  list: U[]
}>()
</script> -->

<style scoped></style>

<script setup lang="ts" generic="T extends ListItemLink">
import { PropType } from 'vue'
import { ApiError } from '../..'

export type ListItemLink = {
  id: string | number
  href: string
  name: string
}

const props = defineProps({
  isPending: {
    type: Boolean,
    required: true
  },
  isError: {
    type: Boolean,
    required: true
  },
  isFetching: {
    type: Boolean,
    required: true
  },
  items: {
    required: true,
    default() {
      return [] as ListItemLink[]
    }
  },
  error: {
    type: [ApiError, null] as PropType<ApiError | null>,
    required: true
  },
  refetch: {
    type: Function,
    required: true
  }
})
// console.log(`[ListViewer] LOAD`)
// console.log(props.items)
// console.log('is error', props.isError)
// console.log('is pending', props.isPending)
// console.log('is fetching', props.isFetching)
// console.log('error', props.error)
// console.log('refetch', props.refetch)
if (props.isError) {
  throw 'This will trigger the upstream error boundary.'
}
</script>
