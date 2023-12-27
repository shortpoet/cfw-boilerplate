<template>
  <div class="page-container" flex-col items-center flex>
    <h1>Auth</h1>
    <Link :href="`/auth`" :title="'back'">
      <i class="i-carbon-page-first" inline-block /><span>back</span>
    </Link>
    <div><i class="i-carbon-user-activity" inline-block /><span>Session</span></div>

    <div v-if="!session" i-carbon-not-available />
    <div v-else>
      <JsonTree :data="session" />
    </div>

    <Login :session="session" :providers="providers">
      <template #login-github="loginProps">
        <FormGeneric
          :inputs="getForm('github')"
          @submit="loginProps.onLogin"
          :hidden="true"
          :title="'Login Github'"
        >
          <template #submit-button>
            <button
              type="submit"
              class="btn-main m-3 text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              id="login-button-github"
              :disabled="loginProps.isLoggedIn"
            >
              <i class="i-carbon-logo-github" inline-block /> Log in Github
            </button>
          </template>
        </FormGeneric>
      </template>
      <template #login-password="loginProps">
        <FormGeneric
          :inputs="getForm('password')"
          :onSubmit="runCallback(loginProps.onLogin)"
          :title="'Login Password'"
        >
          <template #submit-button>
            <div flex flex-row>
              <button
                type="submit"
                class="btn-main m-2 text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                id="login-button-password"
                :disabled="loginProps.isLoggedIn"
              >
                <i class="i-carbon-login" inline-block /> Log in
              </button>
              <button
                type="submit"
                class="btn-main m-2 text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                id="register-button-password"
                :disabled="loginProps.isLoggedIn"
              >
                <i class="i-carbon-login" inline-block /> Register
              </button>
            </div>
          </template>
        </FormGeneric>
      </template>
      <template #login-popup="loginPopupProps">
        <button
          class="btn-main m-3 text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          id="login-button"
          :disabled="loginPopupProps.isLoggedIn"
          @click="loginPopupProps.onLoginPopup"
        >
          Log in Popup
        </button>
      </template>
      <template #logout="logoutProps">
        <button
          class="btn-main m-3 text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          id="logout-button"
          :disabled="logoutProps.authError"
          @click="logoutProps.onLogout"
        >
          Log out
        </button>
      </template>
    </Login>
  </div>
</template>

<script setup lang="ts">
import { LoginOptions, Session } from '#/types'
import type { FormEmitValue, FormInput } from '#/ui/src/components/input/FormGeneric.vue'

const props = defineProps<{
  session?: Session
}>()
const providers = ref(['github', 'password'])
// const pageContext = usePageContext();
// const pageSession = ref(pageContext.session);
const passwordInputs = computed(() => [
  {
    type: 'text',
    value: '',
    placeholder: 'Username',
    key: 'username',
    required: true
  },
  {
    type: 'email',
    value: '',
    placeholder: 'Email',
    key: 'email',
    required: false
  },
  {
    type: 'password',
    value: '',
    placeholder: 'Password',
    key: 'password',
    required: true
  },
  {
    type: 'hidden',
    value: 'false',
    placeholder: 'register',
    key: 'register',
    required: true
  }
])
const getForm = (provider: string): FormInput<LoginOptions>[] => {
  return [
    { type: 'hidden', value: provider, placeholder: 'provider', key: 'provider', required: false }
  ].concat(provider === 'password' ? passwordInputs.value : [])
}
export type LoginFormEvent = FormEmitValue<LoginOptions, ReturnType<typeof getForm>[0]>
const runCallback = (callback: any) => {
  // console.log(`[ui] [auth] [login} [+Page] [setup] :: runCallback`)
  return (...args: LoginFormEvent[]) => {
    // console.log(`[ui] [auth] [login} [+Page] [setup] :: runCallback args`)
    // console.log(args)
    const [{ form, event }] = args
    const submitterId = event instanceof SubmitEvent && event.submitter?.id
    const isRegister = submitterId && submitterId.includes('register') ? true : false
    form.register = isRegister
    console.log(`[ui] [auth] [login} [+Page] [setup] onSubmit emitting inputs`)
    console.log(form)
    callback(...args)
  }
}

let session = ref(props.session)
if (typeof window !== 'undefined' && !session.value) {
  console.log(`[ui] [auth] [login} [+Page] [setup] :: no props session, try to load from cookie`)
  session.value = await useSession(getCookie(LUCIAAUTH_COOKIES_SESSION_TOKEN))
}
</script>
