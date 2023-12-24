<template>
  <div class="navigation">
    <a href="/">
      <img class="logo" :src="logoUrl" height="64" width="64" alt="logo" />
    </a>
    <Link href="/">Home</Link>
    <Link href="/about">About</Link>
    <Link href="/test">Test</Link>
    <Link href="/task">Task</Link>
    <Link href="/api-data">Api Data</Link>
    <Link :href="swaggerUrl" target="_blank" rel="noopener noreferrer">Swagger</Link>
    <Link href="/auth">Auth</Link>
  </div>
</template>

<script setup lang="ts">
import logoUrl from '../../../../public/Old_map_icon.svg'
const { urlBaseApi } = useBaseUrl()
const swaggerUrl = computed(() => `${urlBaseApi}/api/docs`)
</script>
<style scoped>
.logo {
  margin: 0 1rem;
  padding: 0.5rem;
}
</style>
