<template>
  <div class="page-container">
    <ApiViewerFetch :title="title" :data="apiData" :loading="apiDataLoading" :error="apiDataError" />
  </div>
</template>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
}
</style>
  
<script setup lang="ts">
import { initFlashMessage, onErrorFlash, useFlashMessage } from '#/ui/src/modules';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  apiData: {
    type: Object,
    required: false,
  },
  apiDataLoading: {
    type: Boolean,
    required: true,
  },
  apiDataError: {
    type: Object,
    required: false,
  },
});
// const message = 'There was an error fetching the API data.'
// const duration = 5000;
// onErrorFlash(message);
// const error = ref(false);
// const $flashMessage = useFlashMessage();
// onErrorCaptured((callback) => {
//   error.value = true;
//   $flashMessage.duration = duration;
//   $flashMessage.show = true;
//   $flashMessage.text = message;
//   console.error(callback);
//   console.log('#######################################################')
//   return false;
// });
const { apiDataError } = props;
if (apiDataError) {
  throw ('There was an error fetching the API data.');
}

// const $flashMessage = inject('$flashMessage', initFlashMessage());
// const error = ref(false);
// onErrorCaptured((callback) => {
//   error.value = true;
//   $flashMessage.duration = 999999; // show message in 16 minutes
//   $flashMessage.show = true;
//   $flashMessage.text = t('common.errors.unknown');
//   console.error(callback);
//   return false;
// })

</script>
