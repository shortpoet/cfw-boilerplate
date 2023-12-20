<template>
  <main class="page-shell-main">
    <div class="layout">

      <MainNav />
      <div class="main-container">
        <div class="content">
          <slot />
        </div>

        <div class="footer">
          <Footer />
        </div>
      </div>

    </div>
  </main>
</template>

<script lang="ts" setup>
import { meta, title, link } from '../renderer/meta';

useHead({
  title,
  meta,
  link,
})

</script>

<style scoped>
@import url('../styles/page-shell.css');
</style>
