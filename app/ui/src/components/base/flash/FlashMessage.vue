<template>
  <!-- <FlashMsg :flashMessage="$flashMessage" /> -->
  <Flash :flashMessage="$flashMessage" />
</template>

<script setup lang="ts">
const $flashMessage = inject('$flashMessage')
console.log(`[ui] [FlashMessage.vue] useFlashMessage: ${JSON.stringify($flashMessage)}`)
</script>
