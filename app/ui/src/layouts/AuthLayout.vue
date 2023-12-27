<template>
  <FlashMessage />

  <main class="page-shell-main">
    <div class="layout">
      <MainNav />
      <div class="main-container">
        <Suspense>
          <template v-if="authLoading">
            <div flex flex-col class="items-center justify-center p-5">
              <h1
                class="block whitespace-pre-line bg-yellow-200 p-5 rounded-xl text-center text-4xl font-bold"
              >
                {{ `Next Auth\nSession\nLoading ...` }}
              </h1>
              <slot name="fallback" />
            </div>
          </template>
          <template v-else>
            <div class="suspense-wrapper">
              <component :is="pageComponent">
                <slot name="default" />
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

  <div class="layout"></div>
</template>
<style scoped>
@import url('../styles/page-shell.css');
</style>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { UserLayout } from '../layouts'
import { AdminLayout } from '../layouts'
import { useAuthStore } from '../stores'
import { useHead } from '@vueuse/head'
import { meta, title, link } from '../renderer'
import { UserRole } from '#/types'

useHead({
  title,
  meta,
  link
})

let authLoading = ref(true)
const pageContext = usePageContext()
const isAdmin = computed(() =>
  pageContext.session?.user.roles
    ? pageContext.session?.user.roles?.includes(UserRole.Admin)
    : false
)

console.log('[ui] [AuthLayout] [pageContext] isAdmin -> ', isAdmin.value)

let Layout = isAdmin.value ? AdminLayout : UserLayout
const pageComponent = computed(() => {
  console.log('[ui] [AuthLayout] [computed.pageComponent] -> isAdmin ', isAdmin.value)
  return Layout
})

onMounted(async () => {
  const session = ref(pageContext.session)
  const authStore = useAuthStore()
  const auth = useLuciaAuth()
  const { onLoad } = auth
  console.log('[ui] [AuthLayout] [onMounted] session -> ', session.value)
  console.log('[ui] [AuthLayout] [onMounted] authStore.session -> ', authStore.session)
  authStore.clearState()
  console.log('[ui] [AuthLayout] [onMounted] authStore.session -> ', authStore.session)

  if (session.value) {
    console.log('[ui] [AuthLayout] [onMounted] session -> ', session.value)
    console.log('[ui] [AuthLayout] [onMounted] authStore.session -> ', authStore.session)
    authStore.setSession(session.value)
    auth.setSession(session.value)
  }
  await onLoad()
  authLoading.value = auth.authLoading.value
})

onErrorFlash({
  title: 'Auth Error',
  text: 'There was an error authenticating, please try again.',
  duration: 5000
})
</script>
