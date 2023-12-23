<template>
  <FlashMessage />

  <div class="page-container">
    <ApiViewerFetch
      :title="title"
      :data="apiData"
      :loading="apiDataLoading"
      :error="apiDataError"
    />
  </div>
</template>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
}
</style>

<script setup lang="ts">
// // @ts-expect-error figure out why this works but is linted
// import IconDataSuccess from '~icons/carbon/rocket'

// onInfoFlash({
//   title: 'Info Greeting',
//   text: 'Greetings earthling',
//   duration: 5000,
//   icon: markRaw(IconDataSuccess)
// })

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  apiData: {
    type: Object,
    required: false
  },
  apiDataLoading: {
    type: Boolean,
    required: true
  },
  apiDataError: {
    type: Object,
    required: false
  }
})

const { apiDataError } = props
if (apiDataError) {
  throw 'This will trigger the upstream error boundary.'
}
</script>
