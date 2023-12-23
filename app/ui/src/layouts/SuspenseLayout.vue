<template>
  <FlashMessage />

  <main class="page-shell-main">
    <div class="layout">
      <MainNav />
      <div class="main-container">
        <Suspense>
          <template v-if="loading">
            <div flex flex-col class="items-center justify-center p-5">
              <h1
                class="block whitespace-pre-line bg-orange-300 p-5 rounded-xl text-center text-4xl font-bold"
              >
                {{ `\nLoading ...` }}
              </h1>
              <slot name="fallback" />
            </div>
          </template>

          <template v-else>
            <div class="suspense-wrapper">
              <component :is="BlueLayout">
                <Hydrate>
                  <slot name="default" />
                </Hydrate>
              </component>
            </div>
          </template>
        </Suspense>

        <div class="footer">
          <Footer />
        </div>
      </div>
    </div>
  </main>
</template>
<style scoped>
@import url('../styles/page-shell.css');
</style>

<script lang="ts" setup>
import BlueLayout from './BlueLayout.vue'
import { meta, title, link } from '../renderer/meta'
import Hydrate from './Hydrate.vue'
//
useHead({
  title,
  meta,
  link
})

const loading = ref(true)

onMounted(async () => {
  loading.value = false
})
onErrorFlash({
  title: 'Fetch Error',
  text: 'There was an error fetching the API data.',
  duration: 5000
})
</script>
