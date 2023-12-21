import { App } from 'vue';

export interface FlashMessage {
  show: boolean;
  duration?: number;
  modifiers: string[];
  title?: string;
  text?: string;
  icon: string;
}

export function initFlashMessage(options?: Partial<FlashMessage>): FlashMessage {
  const defaults = {
    show: false,
    duration: 5000,
    modifiers: ['error'],
    icon: 'info',
  };

  return {
    ...defaults,
    ...options,
  };
}

export const provideFlashMessage = (app: App) => {
  app.provide('$flashMessage', reactive(initFlashMessage()));
};

export const useFlashMessage = () => inject('$flashMessage', initFlashMessage());

export const onErrorFlash = (message: string, duration = 999999 /* 16 mins */) => {
  const error = ref(false);
  const $flashMessage = useFlashMessage();
  onErrorCaptured((callback) => {
    error.value = true;
    $flashMessage.duration = duration;
    $flashMessage.show = true;
    $flashMessage.text = message;
    console.error(callback);
    return false;
  });
};
