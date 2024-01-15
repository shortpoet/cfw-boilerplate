<template>
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

  <TeleModal>
    <template #trigger>
      <div v-if="!isLoggedIn">You must be logged in to verify</div>
      <button
        type="button"
        class="btn-main m-2 text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        id="verify-button-modal"
        :disabled="!isLoggedIn"
      >
        <i class="i-carbon-login" inline-block /> Verify
      </button>
    </template>
    <template #body>
      <FormGeneric
        :inputs="getLogsterForm('verify_email')"
        :onSubmit="onVerifyEmail"
        :title="'Verify Email'"
        :isToggleable="false"
        p-2
        text-black
      >
        <template #submit-button>
          <div flex flex-col class="verify-form-submit-controls">
            <div flex flex-row class="verify-form-submit-buttons">
              <button
                type="submit"
                class="btn-main m-2 text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                id="verify-button-submit"
                :disabled="!isLoggedIn"
              >
                <i class="i-carbon-login" inline-block /> Get code
              </button>
            </div>
          </div>
        </template>
      </FormGeneric>
      <div class="verify-email-message">{{ verifyEmailMessage }}</div>
      <div class="verify-form-divider" />
      <div class="verify-code-message">{{ verifyCodeMessage }}</div>

      <FormGeneric
        :inputs="getLogsterForm('verify_code')"
        :onSubmit="onVerifyCode"
        :title="'Verify Code'"
        :isToggleable="false"
        p-2
        text-black
      >
        <template #submit-button>
          <div flex flex-col class="verify-form-submit-controls">
            <div flex flex-row class="verify-form-submit-buttons">
              <button
                type="submit"
                class="btn-main m-2 text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                id="verify-button-submit"
                :disabled="false"
              >
                <i class="i-carbon-login" inline-block /> Verify code
              </button>
            </div>
          </div>
        </template>
      </FormGeneric>
    </template>
  </TeleModal>
</template>

<script setup lang="ts">
import { LoginFormEvent } from '#/types'

let authLoading = ref(false)
let authError = ref()
let isLoggedIn = ref(false)
let onVerifyEmail = (event: any) => {
  console.log(`[ui] [auth} [validate] [onVerifyEmail] ${event}`)
}
const verifyEmailMessage = ref('')
const verifyCodeMessage = ref('')
let onVerifyCode = (event: any) => {
  console.log(`[ui] [auth} [validate] [verifyEmailMessage] ${event}`)
}

if (typeof window !== 'undefined') {
  const auth = useLuciaAuth()
  const { verifyEmail, verifyCode } = auth
  ;({ authError, isLoggedIn } = auth)
  onVerifyEmail = async (event: LoginFormEvent) => {
    authLoading.value = true
    console.log(`[ui] [auth} [validate] [onVerifyEmail] event`)
    console.log(event)
    try {
      const res = await verifyEmail(event.form)
      console.log(`[ui] [auth} [validate] [onVerifyEmail] res -> `)
      console.log(res)
      verifyEmailMessage.value = `Verification code sent to ${event.form.email} at ${res?.timeSent} expires at ${res?.expiration}`
    } catch (error) {
      authError.value = error
    }
    authLoading.value = false
  }
  onVerifyCode = async (event: LoginFormEvent) => {
    authLoading.value = true
    try {
      const res = await verifyCode(event.form)
      console.log(`[ui] [auth} [validate] [onVerifyCode] res -> `)
      console.log(res)
      verifyCodeMessage.value = `Verified new session for ${res?.user.username}`
    } catch (error) {
      authError.value = error
    }
    authLoading.value = false
  }
}
</script>
