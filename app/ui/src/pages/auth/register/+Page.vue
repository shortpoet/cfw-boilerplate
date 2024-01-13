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
          :inputs="getForm('oauth')"
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
      <template #login-register="loginProps">
        <FormGeneric
          :inputs="getForm('register')"
          :onSubmit="runCallback(loginProps.onLogin)"
          :title="'Login Register'"
        >
          <template #submit-button>
            <div flex flex-col class="register-form-submit-controls">
              <div flex flex-row justify-around class="register-form-radio-container">
                <div class="register-form-radio">
                  <input
                    class="m-2"
                    type="radio"
                    id="login-radio"
                    name="login-radio"
                    value="login"
                    v-model="loginFormType"
                  />
                  <label for="login-radio">Login</label>
                </div>
                <div class="register-form-radio">
                  <input
                    class="m-2"
                    type="radio"
                    id="register-radio"
                    name="register-radio"
                    value="register"
                    v-model="loginFormType"
                  />
                  <label for="register-radio">Register</label>
                </div>
              </div>
              <div flex flex-row class="register-form-submit-buttons">
                <button
                  type="submit"
                  class="btn-main m-2 text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                  id="login-button-password"
                  :disabled="loginProps.isLoggedIn"
                >
                  <i class="i-carbon-login" inline-block /> Log in
                </button>

                <TeleModal />

                <button
                  type="submit"
                  class="btn-main m-2 text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                  id="register-button-password"
                  :disabled="loginProps.isLoggedIn"
                >
                  <i class="i-carbon-login" inline-block /> Register
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
  LoginOptions,
  Session,
  LoginOptionsTypes,
  LoginOptionsTypesEnum,
  OauthProvidersEnum,
  OauthProviders
} from '#/types'
import type { FormEmitValue, FormInput } from '#/ui/src/components/input/FormGeneric.vue'

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
  // LoginOptionsTypesEnum.Enum.email,
  // LoginOptionsTypesEnum.Enum.username,
  LoginOptionsTypesEnum.Enum.register,
  LoginOptionsTypesEnum.Enum.oauth
])
// const pageContext = usePageContext();
// const pageSession = ref(pageContext.session);
const loginFormType = ref<'register' | 'login'>()

type ProviderButton = {
  provider: OauthProviders
  name: string
  icon: string
}

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

const passwordInputs: ComputedRef<FormInput<LoginOptions>[]> = computed(() => [
  {
    type: 'text',
    value: '',
    placeholder: 'Username',
    key: 'username',
    required: loginFormType.value === LoginOptionsTypesEnum.Enum.register ? true : false
  },
  {
    type: 'email',
    value: '',
    placeholder: 'Email',
    key: 'email',
    required: loginFormType.value === LoginOptionsTypesEnum.Enum.register ? true : false
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
    value: undefined,
    placeholder: 'type',
    key: 'type',
    required: true
  },
  {
    type: 'hidden',
    value: undefined,
    placeholder: 'provider',
    key: 'provider',
    required: false
  }
])
const getForm = (type: LoginOptionsTypes): FormInput<LoginOptions>[] => {
  console.log(`[ui] [auth] [login} [+Page] [setup] :: getForm`)
  console.log(`[ui] [auth] [login} [+Page] [setup] :: getForm type ${type}`)

  const isLoginForm =
    type === LoginOptionsTypesEnum.Enum.email ||
    type === LoginOptionsTypesEnum.Enum.username ||
    type === LoginOptionsTypesEnum.Enum.register
  console.log(`[ui] [auth] [login} [+Page] [setup] :: getForm isLoginForm ${isLoginForm}`)

  const form = [
    { type: 'hidden', value: type, placeholder: 'type', key: 'type', required: false }
  ].concat(isLoginForm ? passwordInputs.value : [])

  // console.log(`[ui] [auth] [login} [+Page] [setup] :: getForm form`)
  console.log(form.find((input) => input.key === 'username'))
  console.log(form.find((input) => input.key === 'email'))
  // console.log(form.find((input) => input.key === 'provider'))
  return form
}
export type LoginFormEvent = FormEmitValue<LoginOptions>
const runCallback = (callback: any) => {
  // console.log(`[ui] [auth] [login} [+Page] [setup] :: runCallback`)
  return (...args: LoginFormEvent[]) => {
    console.log(`[ui] [auth] [login} [+Page] [setup] :: runCallback args`)
    console.log(args)
    const [{ form, event }] = args

    const submitterId = event instanceof SubmitEvent && event.submitter?.id
    const isRegister = submitterId && submitterId.includes('register') ? true : false

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

    // console.log(`[ui] [auth] [login} [+Page] [setup] :: runCallback submitterId ${submitterId}`)
    const hasEmail = form.email && form.email.length > 0
    const hasUsername = form.username && form.username.length > 0
    form.type = isRegister ? 'register' : hasEmail ? 'email' : hasUsername ? 'username' : 'oauth'
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
