<template>
  <transition :duration="{ enter: duration || 5000, leave: 250 }" @after-enter="show = false">
    <div :class="classStyle" class="alert" v-if="show" @close="show = false">
      <!-- <div>
        <component :is="icon" />
      </div> -->
      <strong>{{ title }}</strong> {{ text }}

      <button
        class="opacity-75 cursor-pointer absolute top-0 right-0 py-2 px-3 hover:opacity-100"
        @click="show = false"
      >
        &times;
      </button>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { clsx } from 'clsx'

const props = defineProps({
  flashMessage: {
    type: Object,
    default: null
  }
})
const { flashMessage } = toRefs(props)
const { show, title, text, modifiers, icon, duration } = toRefs(flashMessage.value)
const classStyle = computed(() =>
  clsx({
    'alert-success': modifiers.value.includes('success'),
    'alert-error': modifiers.value.includes('error'),
    'alert-warning': modifiers.value.includes('warning'),
    'alert-info': modifiers.value.includes('info')
  })
)
console.log(`[ui] [Flash.vue] flashMessage: ${JSON.stringify(flashMessage.value)}`)
console.log(`[ui] classStyle: ${JSON.stringify(classStyle.value)}`)
</script>

<style scoped>
/* enter transitions */

.alert {
  padding: 3rem;
  color: white;
  font-weight: bold;
}
.alert-success {
  background-color: #4caf50;
}
.alert-info {
  background-color: #2196f3;
}
.alert-warning {
  background-color: #ff9800;
}
.alert-error {
  background-color: #f44336;
}

.v-enter-from {
  transform: translateY(-66px);
}

.v-enter-to {
  transition: all 0.3s ease;
  transform: translateY(0px);
  position: sticky;
  top: 0;
}

/* leave transitions */
.v-leave-active {
  transition: all 0.4s ease;
  transform: translateY(-66px);
}
</style>
