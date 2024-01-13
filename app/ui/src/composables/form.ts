import { LoginOptionsTypes, FormInput, LoginForm, LoginOptionsTypesEnum } from '#/types'

export const getLogsterForm = (type: LoginOptionsTypes): FormInput<LoginForm>[] => {
  const base: FormInput<LoginForm> = {
    type: 'hidden',
    value: type,
    placeholder: 'type',
    key: 'type',
    required: true
  }
  const email: FormInput<LoginForm> = {
    type: 'email',
    value: '',
    placeholder: 'Email',
    key: 'email',
    required: true
  }
  const username: FormInput<LoginForm> = {
    type: 'text',
    value: '',
    placeholder: 'Username',
    key: 'username',
    required: true
  }
  const password: FormInput<LoginForm> = {
    type: 'password',
    value: '',
    placeholder: 'Password',
    key: 'password',
    required: true
  }
  const provider: FormInput<LoginForm> = {
    type: 'hidden',
    value: '',
    placeholder: 'provider',
    key: 'provider',
    required: false
  }
  // console.log(`[ui] [composables] [form] [getLogsterForm] type: ${type}`)

  switch (type) {
    case LoginOptionsTypesEnum.Enum.register:
      return [base, email, username, password]
    case LoginOptionsTypesEnum.Enum.email:
      return [base, email, password]
    case LoginOptionsTypesEnum.Enum.username:
      return [base, username, password]
    case LoginOptionsTypesEnum.Enum.oauth:
      return [base, provider]
  }
}
