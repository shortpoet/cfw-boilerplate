import { LoginForm, OauthProviders } from './auth'

export interface UiState {
  alaCartePath: Ref<string>
  otherPaths: ComputedRef<string[]>
  setNewPath: (name: string) => void
}

export type ProviderButton = {
  provider: OauthProviders
  name: string
  icon: string
}

export type FormInput<T> = {
  key: string
  type: 'text' | 'password' | 'email' | 'number' | 'hidden'
  value: any
  placeholder: string
  required: boolean
}
export type FormInputArray<T> = FormInput<T>[]

export type FormEmitValue<T> = {
  form: { [K in keyof T]: T[K] }
  //form: { [key: string]: string }
  event: Event
}

export type LoginFormEvent = FormEmitValue<LoginForm>
