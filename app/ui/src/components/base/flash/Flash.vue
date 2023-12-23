<template>
  <div class="fixed top-0 right-0 m-6">
    <Transition name="slide-fade" :duration="{ enter: duration || 5000, leave: 250 }" @after-enter="show = false">
      <div v-if="show" @close="show = false" :class="classStyle" class="rounded-lg shadow-md p-6 pr-10"
        style="min-width: 240px">
        <div>
          Icon
          <component :is="icon" />
        </div>
        <button class="opacity-75 cursor-pointer absolute top-0 right-0 py-2 px-3 hover:opacity-100"
          @click="show = false">
          &times;
        </button>
        <div class="flex items-center">
          <div i-carbon-data-error class="mr-3"></div>
          <strong>{{ title }}&nbsp;</strong>&nbsp;{{ text }}
        </div>
      </div>
    </Transition>
  </div>
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
//log params
console.log(`[ui] [Flash.vue] show: ${JSON.stringify(show.value)}`)
console.log(`[ui] [Flash.vue] title: ${JSON.stringify(title?.value || 'no title')}`)
console.log(`[ui] [Flash.vue] text: ${JSON.stringify(text?.value)} || 'no text'`)
console.log(`[ui] [Flash.vue] modifiers: ${JSON.stringify(modifiers.value)}`)
console.log(`[ui] [Flash.vue] icon: ${JSON.stringify(icon.value)}`)
console.log(`[ui] [Flash.vue] duration: ${JSON.stringify(duration.value)}`)
</script>

<style scoped>
/* enter transitions */
/* .v-enter-from {
  transform: translateY(-66px);
} */

/* .v-enter-to {
  transition: all 0.3s ease;
  transform: translateY(0px);
  position: sticky;
  top: 0;
} */

/* leave transitions */
/* .v-leave-active {
  transition: all 0.4s ease;
  transform: translateY(-66px);
} */



.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s;
}

.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(400px);
  opacity: 0;
}

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
</style>
