<template>
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
let authLoading = ref(false)
let authError = ref()
let isLoggedIn = ref(false)
let onVerifyEmail = (event: any) => {
  console.log(`[ui] [login.component] womp login ${event}`)
}
let onVerifyCode = (event: any) => {
  console.log(`[ui] [login.component] womp login ${event}`)
}

if (typeof window !== 'undefined') {
  const auth = useLuciaAuth()
  const { verifyEmail, verifyCode } = auth
  ;({ authError, isLoggedIn } = auth)
  onVerifyEmail = async (event: any) => {
    event.preventDefault()
    authLoading.value = true
    const { email } = event.target.elements
    try {
      await verifyEmail(email.value)
    } catch (error) {
      authError.value = error
    }
    authLoading.value = false
  }
  onVerifyCode = async (event: any) => {
    event.preventDefault()
    authLoading.value = true
    const { code } = event.target.elements
    try {
      await verifyCode(code.value)
    } catch (error) {
      authError.value = error
    }
    authLoading.value = false
  }
}
</script>
