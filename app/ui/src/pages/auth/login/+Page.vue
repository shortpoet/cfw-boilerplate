<template>
  <div class="page-container" flex-col items-center flex>
    <h1>Auth</h1>
    <Link :href="`/auth`" :title="'back'">
      <i class="i-carbon-page-first" inline-block /><span>back</span>
    </Link>
    <div><i class="i-carbon-user-activity" inline-block /><span>Session</span></div>

    <div v-if="!session" i-carbon-not-available />
    <div v-else>
      <div flex flex-col @click="toggleSession">
        <div :class="sessionContainerClass" />
        <span class="form-title">Show Session</span>
        <div :class="sessionDisplayClass">
          <JsonTree :data="session" />
        </div>
      </div>
    </div>

    <Login :session="session" :loginTypes="loginTypes">
      <!-- template name/id must match LoginOptionsTypesEnum.Enum -->
      <template #login-oauth="loginProps">
        <FormGeneric
          :inputs="getLogsterForm('oauth')"
          :onSubmit="runCallback(loginProps.onLogin)"
          :hidden="true"
          :title="'Login Oauth'"
        >
          <template #submit-button>
            <button
              v-for="provider in providers"
              :key="provider.provider"
              type="submit"
              class="btn-main m-3 text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              :id="`login-button-oauth-${provider.provider}`"
              :disabled="loginProps.isLoggedIn"
            >
              <i :class="provider.icon" inline-block /> Log in {{ provider.name }}
            </button>
          </template>
        </FormGeneric>
      </template>

      <template #login-username="loginProps">
        <FormGeneric
          :inputs="getLogsterForm('username')"
          :onSubmit="runCallback(loginProps.onLogin)"
          :title="'Login username'"
        >
          <template #submit-button>
            <div flex flex-col class="login-username-form-submit-controls">
              <div flex flex-row class="login-username-form-submit-buttons">
                <button
                  type="submit"
                  class="btn-main m-2 text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                  id="login-username-button-password"
                  :disabled="loginProps.isLoggedIn"
                >
                  <i class="i-carbon-login" inline-block /> Log in Username
                </button>
              </div>
            </div>
          </template>
        </FormGeneric>
      </template>

      <template #login-email="loginProps">
        <FormGeneric
          :inputs="getLogsterForm('email')"
          :onSubmit="runCallback(loginProps.onLogin)"
          :title="'Login Email'"
        >
          <template #submit-button>
            <div flex flex-col class="login-email-form-submit-controls">
              <div flex flex-row class="login-email-form-submit-buttons">
                <button
                  type="submit"
                  class="btn-main m-2 text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                  id="login-email-button-password"
                  :disabled="loginProps.isLoggedIn"
                >
                  <i class="i-carbon-login" inline-block /> Log in Email
                </button>
              </div>
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
import {
  Session,
  LoginOptionsTypes,
  LoginOptionsTypesEnum,
  OauthProvidersEnum,
  LoginFormEvent,
  ProviderButton
} from '#/types'

const showSession = ref(true)
const toggleSession = () => {
  showSession.value = !showSession.value
}

const sessionContainerClass = computed(() => ({
  'i-carbon-caret-down form-icon': !showSession.value,
  'i-carbon-caret-up form-icon': showSession.value
}))

const sessionDisplayClass = computed(() => {
  return {
    hidden: !showSession.value
  }
})

const props = defineProps<{
  session?: Session
}>()
const loginTypes = ref<LoginOptionsTypes[]>([
  LoginOptionsTypesEnum.Enum.email,
  LoginOptionsTypesEnum.Enum.username,
  // LoginOptionsTypesEnum.Enum.register,
  LoginOptionsTypesEnum.Enum.oauth
])

const providers = ref<ProviderButton[]>([
  {
    provider: OauthProvidersEnum.Enum.github,
    name: 'Github',
    icon: 'i-carbon-logo-github'
  },
  {
    provider: OauthProvidersEnum.Enum.google,
    name: 'Google',
    icon: 'i-carbon-logo-google'
  }
  // {
  //   provider: OauthProvidersEnum.Enum.facebook,
  //   name: 'Facebook',
  //   icon: 'i-carbon-logo-facebook'
  // },
  // {
  //   provider: OauthProvidersEnum.Enum.twitter,
  //   name: 'Twitter',
  //   icon: 'i-carbon-logo-twitter'
  // }
])

const runCallback = (callback: any) => {
  // console.log(`[ui] [auth] [login} [+Page] [setup] :: runCallback`)
  return (...args: LoginFormEvent[]) => {
    console.log(`[ui] [auth] [login} [+Page] [setup] :: runCallback args`)
    console.log(args)
    const [{ form, event }] = args
    console.log(`[ui] [auth] [login} [+Page] [setup] :: runCallback form type`)
    console.log(form.type)

    const submitterId = event instanceof SubmitEvent && event.submitter?.id

    if (submitterId && submitterId.includes('oauth')) {
      console.log(
        `[ui] [auth] [login} [+Page] [setup] :: runCallback oauth submitterId ${submitterId}`
      )
      const provider = submitterId.replace('login-button-oauth-', '')
      console.log(`[ui] [auth] [login} [+Page] [setup] :: runCallback provider ${provider}`)
      const parsed = OauthProvidersEnum.safeParse(provider)
      if (parsed.success) {
        form.provider = parsed.data
      }
    }
    console.log(`[ui] [auth] [login} [+Page] [setup] onSubmit emitting inputs`)
    console.log(form)
    callback(...args)
  }
}

let session = ref(props.session)
if (typeof window !== 'undefined' && !session.value) {
  console.log(`[ui] [auth] [login} [+Page] [setup] :: no props session, try to load from cookie`)
  // session.value = await useSession(getCookie(LUCIAAUTH_COOKIES_SESSION_TOKEN))
}
</script>
