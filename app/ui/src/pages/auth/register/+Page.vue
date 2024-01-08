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
      <template #login-register="loginProps">
        <FormGeneric
          :inputs="getLogsterForm('register')"
          :onSubmit="runCallback(loginProps.onLogin)"
          :title="'Login Register'"
        >
          <template #submit-button>
            <div flex flex-col class="register-form-submit-controls">
              <div flex flex-row class="register-form-submit-buttons">
                <TeleModal>
                  <template #body>
                    <button
                      type="button"
                      class="btn-main m-2 text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                      id="verify-button-password"
                      :disabled="loginProps.isLoggedIn"
                    >
                      <i class="i-carbon-login" inline-block /> Verify
                    </button>
                  </template>
                </TeleModal>

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
    </Login>
  </div>
</template>

<script setup lang="ts">
import {
  Session,
  LoginOptionsTypes,
  LoginOptionsTypesEnum,
  OauthProvidersEnum,
  LoginFormEvent
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
const loginTypes = ref<LoginOptionsTypes[]>([LoginOptionsTypesEnum.Enum.register])
// const pageContext = usePageContext();
// const pageSession = ref(pageContext.session);

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
