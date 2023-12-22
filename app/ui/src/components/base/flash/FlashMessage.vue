<template>
  <FlashMsg :flashMessage="$flashMessage" />
</template>

<script setup lang="ts">
const $flashMessage = inject('$flashMessage')
console.log(`[ui] [FlashMessage.vue] useFlashMessage: ${JSON.stringify($flashMessage)}`)
</script>
