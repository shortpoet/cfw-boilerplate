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
import { onErrorFlash } from '#/ui/src/modules';

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

const { apiDataError } = props;
if (apiDataError) {
  throw ('There was an error fetching the API data.');
}
onErrorFlash('There was an error fetching the API data.', 15);

</script>
