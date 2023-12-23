import { App } from 'vue'

export interface FlashMessage {
  show: boolean
  duration?: number
  modifiers: string[]
  title?: string
  text?: string
  icon?: string
}

// @ts-expect-error figure out why this works but is linted
import IconInfo from '~icons/carbon/information'

export function initFlashMessage(options?: Partial<FlashMessage>): FlashMessage {
  const defaults = {
    show: false,
    duration: 5000,
    modifiers: ['error'],
    icon: markRaw(IconInfo)
  }

  return {
    ...defaults,
    ...options
  }
}

let $flashMessage: FlashMessage

export const provideFlashMessage = (app: App) => {
  app.provide('$flashMessage', reactive(initFlashMessage()))
}

export const useFlashMessage = (options?: Partial<FlashMessage>) => {
  console.log(`[ui] useFlashMessage:`)
  if (!$flashMessage) {
    $flashMessage = inject('$flashMessage', initFlashMessage())
  }
  if (options) {
    console.log(`[ui] useFlashMessage: options:`, options)
    $flashMessage = Object.assign($flashMessage, options)
  }
  return $flashMessage
}

export const onFlash = ({
  title,
  text,
  modifiers,
  icon,
  duration = 5000 /* 5 seconds */,
  show = true
}: {
  title: string
  text: string
  icon?: string
  modifiers?: string[]
  duration?: number
  show?: boolean
}) => {
  onMounted(() => {
    modifiers = modifiers || ['info']
    const $flashMessage = useFlashMessage({ title, text, duration, icon, modifiers })
    $flashMessage.show = true
  })
}

export const onErrorFlash = ({
  title,
  text,
  duration = 999999 /* 16 mins */,
  icon
}: {
  title: string
  text: string
  duration?: number
  icon?: string
}) => {
  // console.log(`[ui] onErrorFlash: ${title} - ${text} - ${duration}`)
  // console.log(`[ui] onErrorFlash: ${error.value}`)
  const $flashMessage = useFlashMessage({ title, duration, icon, modifiers: ['error'] })
  onErrorCaptured((callback) => {
    const errText =
      typeof callback === 'string' && !!callback
        ? callback
        : callback instanceof Error
          ? callback.message
          : text
    $flashMessage.text = errText
    $flashMessage.show = true
    console.error(errText)
    return false
  })
}
