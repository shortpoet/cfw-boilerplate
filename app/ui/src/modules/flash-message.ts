import { App } from 'vue'

export interface FlashMessage {
  show: boolean
  duration?: number
  modifiers: string[]
  title?: string
  text?: string
  icon: string
}

export function initFlashMessage(options?: Partial<FlashMessage>): FlashMessage {
  const defaults = {
    show: false,
    duration: 5000,
    modifiers: ['error'],
    icon: 'info'
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
  if (!$flashMessage) {
    $flashMessage = inject('$flashMessage', initFlashMessage())
  }
  if (options) {
    Object.assign($flashMessage, options)
  }
  return $flashMessage
}

const assertNonEmptyString = (value: unknown) => typeof value !== 'string' || !value

export const onErrorFlash = ({
  title,
  text,
  duration = 999999 /* 16 mins */
}: {
  title: string
  text: string
  duration?: number
}) => {
  console.log(`[ui] onErrorFlash: ${title} - ${text} - ${duration}`)
  const error = { value: false }
  console.log(`[ui] onErrorFlash: ${error.value}`)
  const $flashMessage = useFlashMessage({ title, text, duration })

  onErrorCaptured((callback) => {
    const errText = typeof callback === 'string' && !!callback ? callback : text
    $flashMessage.title = title
    $flashMessage.text = errText
    error.value = true
    $flashMessage.duration = duration
    $flashMessage.show = true
    $flashMessage.modifiers = ['error']
    console.error(errText)
    return false
  })
}
