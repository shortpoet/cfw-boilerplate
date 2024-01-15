<template>
  <div v-if="authLoading">authLoading...</div>
  <div v-else>
    <div v-if="authError">
      <!-- <div>
        <slot name="logout" :onLogout="onLogout" :isLoggedIn="isLoggedIn" />
      </div> -->
      <div flex flex-row @click="authError = false">
        <div m-2 text-2xl text-red i-carbon-close />
        <div class="text-red">{{ authError.name }}</div>
      </div>
      <div>
        <JsonTree :data="authError" />
      </div>
    </div>

    <div v-for="lt in loginTypes" :key="lt">
      <slot
        :name="`login-${lt}`"
        :onLogin="onLogin"
        :isLoggedIn="isLoggedIn"
        :onVerify="onVerify"
      />
    </div>
    <!-- <div>
      <slot name="login-popup" :onLoginPopup="onLoginPopup" :isLoggedIn="isLoggedIn" />
    </div> -->
    <div>
      <slot name="logout" :onLogout="onLogout" :isLoggedIn="isLoggedIn" />
    </div>
    <ul>
      <li>User Info - Props</li>
      <div v-if="!session" i-carbon-bot />
      <div v-else>
        {{ session }}
      </div>
      <li>User Info - Page</li>
      <div v-if="!pageSession" i-carbon-bot />
      <div v-else>
        {{ pageSession }}
      </div>
      <li>User Info - Store</li>
      <div v-if="!storeSession" i-carbon-bot />
      <div v-else>
        {{ storeSession }}
      </div>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { User, Session, LoginOptionsTypes, LoginFormEvent } from '#/types'

defineProps<{
  session?: Session
  usePopup?: boolean
  loginTypes?: LoginOptionsTypes[]
}>()
let onLogin = ref((event: any) => {
  console.log(`[ui] [login.component] womp login ${event}`)
})
let onLogout = ref((event: any) => {
  console.log(`[ui] [login.component] logout ${event}`)
})
let onLoginPopup = ref((event: any) => {
  console.log(`[ui] [login.component] login popup ${event}`)
})
let onVerify = ref((event: any) => {
  console.log(`[ui] [login.component] verify ${event}`)
})

let user = ref<User>()
let storeSession = ref<Session>()

let authLoading = ref(false)
let authError = ref()
let isLoggedIn = ref(false)

const pageContext = usePageContext()
const pageSession = ref(pageContext.session)

if (import.meta.env.VITE_LOG_LEVEL === 'debug') {
  // console.log('[ui] [login.component] setup done')
  // console.log(`[ui] [login.component] login slot`)
  // console.log(loginSlot);
}

if (typeof window !== 'undefined') {
  // console.log(
  //   "[ui] [login.component] typeof window !== 'undefined' -> can now load things that would break SSR"
  // )
  const auth = useLuciaAuth()
  const { login, logout, loginOauth, register, verifyEmail, verifyCode } = auth
  ;({ authError, isLoggedIn } = auth)
  // console.log(`[ui] [login.component] authError ${authError.value}`)
  user = auth.user || user
  const authStore = useAuthStore()

  // console.log(`[ui] [login.component] authStore.session`)
  // console.log(authStore.session)
  // console.log(`[ui] [login.component] storeSession.`)
  // console.log(storeSession.value)

  storeSession.value = authStore.session || storeSession.value

  onVerify.value = async (event: any) => {
    console.log('[ui] [login.component] onVerify')
    console.log(event)
    if (event.form.type === 'verify_email') {
      await verifyEmail(event.form)
    } else if (event.form.type === 'verify_code') {
      await verifyCode(event.form)
    }
  }
  onLogin.value = async (event: LoginFormEvent) => {
    console.log('[ui] [login.component] onLogin')
    console.log(event)
    console.log(event.form.type)
    try {
      switch (true) {
        case event.form.type === 'oauth':
          await loginOauth(event.form)
          break
        case event.form.type === 'register':
          await register(event.form)
          break
        default:
          await login(event.form)
          break
      }
    } catch (error) {
      console.log(`[ui] [login.component] error`)
      console.log(error)
    }
  }
  onLoginPopup.value = async (event: any) => {
    console.log('[ui] [login.component] onLoginPopup')
    // cookies.set(COOKIES_USER_TOKEN, true, cookieOptions)
    // await loginWithPopup();
  }
  onLogout.value = async (event: any) => {
    console.log('[ui] [login.component] onLogout')
    // cookies.remove(COOKIES_USER_TOKEN, cookieOptions);
    // cookies.remove(COOKIES_SESSION_TOKEN, cookieOptions)
    await logout()
    authStore.setLoggedIn(false)
  }
}
</script>
