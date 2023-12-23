<template>
  <FlashMessage />

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
// // @ts-expect-error figure out why this works but is linted
// import IconDataSuccess from '~icons/carbon/rocket'

// onInfoFlash({ title: 'Info Greeting', text: 'Greetings earthling', duration: 5000, icon: markRaw(IconDataSuccess) })

import { meta, title, link } from '../renderer/meta'
useHead({
  title,
  meta,
  link
})

onMounted(async () => {})
</script>

<style scoped>
@import url('../styles/page-shell.css');
</style>
