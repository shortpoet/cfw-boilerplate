<template>
  <div class="page-container" flex-col items-center flex wrap>
    <!-- constrain row to 5 elements -->
    <nav flex flex-row flex-wrap items-center justify-center :class="getClass">
      <div v-for="ep in endpoints" :key="ep.path" class="w-1/4 box-border" p-1>
        <Link btn-purple v-bind="attrsObj" :href="`${ep.path}`">{{ ep.title }}</Link>
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

const getClass = computed(() => {
  return {
    // 'max-w-2xl': true,
    // 'w-full': true,
    // 'flex-wrap': true,
    // 'flex-row': true,
    // 'flex': '1 0 calc(25% - 10px)',
    // 'items-center': true,
    // 'justify-center': true,
  };
});

emit('loaded', true);

useAttrs();

</script>
