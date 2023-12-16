<template>
  <div class="page-container" flex-col items-center flex>
    <nav flex flex-row>
      <div v-for="ep in endpoints" :key="ep.path">
        <Link btn-purple v-bind="attrsObj" :href="`/api-data/${ep.path}`">{{ ep.title }}</Link>
      </div>
    </nav>
  </div>
</template>
<script setup lang="ts">
import { useAttrs } from 'vue';
const attrsObj = {
  bg: 'blue-400 hover:blue-500 dark:blue-500 dark:hover:blue-600',
  // text: 'sm white', // this causes a bug that changes inner html
  font: 'mono light',
  p: 'y-2 x-4',
  border: '2 rounded blue-200',
};

defineProps({
  endpoints: {
    type: Array as () => { title: string; path: string }[],
    required: true,
  },
});

console.log(`[ui] [api-data] [index.page.vue] [setup] ::`);

const emit = defineEmits(['loaded']);

emit('loaded', true);

useAttrs();

</script>
