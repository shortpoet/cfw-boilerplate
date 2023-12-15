<template>
  <button type="button" @click="state.count++">Counter {{ state.count }}</button>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useLogger } from '../../modules/logger';
const state = reactive({ count: 0 })
const logger = useLogger();
logger.info('[counter] START');

</script>
