import { Directive } from 'vue'

const passwordRegex = /^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])(?=.*[A-Z])(?=.*\d).{3,32}$/
const constraints = {
  required: (value: string, ...args: any) => !!value || 'Required.',
  number: (value: string) => /^\d+$/.test(value) || 'Only numbers allowed.',
  text: (value: string) => /^[a-zA-Z]+$/.test(value) || 'Only text allowed.',
  counter: (value: string) => value.length <= 10 || 'Max 10 characters',
  email: (value: string) => /.+@.+\..+/.test(value) || 'Invalid e-mail.',
  password: (value: string) => passwordRegex.test(value) || 'Invalid password.'
}

export const useValidation = () => {
  const errors = ref({})
  const _errors = ref({})

  const validate = (el: HTMLInputElement, rules: any) => {
    const value = el.value
    const rulesArray = rules.split('|')
    for (let rule of rulesArray) {
      // console.log(`[ui] [useValidation] [validate] -> rule: <${rule}>`)
      const ruleArgs = rule.split(':')
      const ruleName = ruleArgs.shift()
      if (ruleName && Object.keys(constraints).includes(ruleName)) {
        // console.log(`[ui] [useValidation] [validate] -> ruleName: <${ruleName}>`)
        // console.log(`[ui] [useValidation] [validate] -> rules`)
        // console.log(rules)
        const ruleFn = constraints[ruleName as keyof typeof constraints]
        if (typeof ruleFn === 'function') {
          const isValid = ruleFn(value, ...ruleArgs)
          // console.log(`[ui] [useValidation] [validate] -> isValid: <${isValid}>`)
          if (isValid !== true) {
            return isValid
          }
        } else {
          console.warn(`Function "${ruleFn}" is not a function.`)
        }
      } else {
        console.warn(`Rule "${ruleName}" is not defined.`)
      }
    }
    return ''
  }

  const updateMessages = (el: HTMLInputElement) =>
    (errors.value = Object.assign({}, errors.value, {
      [`${el.getAttribute('name')}`]: el.validationMessage
    }))

  const vValidate: Directive<HTMLInputElement, any> = {
    mounted(el, binding, vnode, prevVnode) {
      // console.log(`[ui] [useValidation] [vValidate] -> mounted`)
      // console.log(el)
      // console.log(binding.value)
      el.addEventListener('input', (e) => {
        // console.log(`[ui] [useValidation] [vValidate] -> change`)
        // console.log(e)
        const validity = validate(el, binding.value)
        _errors.value = Object.assign({}, _errors.value, {
          [binding.value]: validity
        })
        // console.log(`[ui] [useValidation] [vValidate] -> validity: <${validity}>`)
        el.setCustomValidity(validity)
      })
      el.onblur = () => (errors.value = _errors.value)

      // el.addEventListener('input', (e) => {
      //   // errors = Object.assign({}, errors, { [binding.value]: validate(e.target.value, binding.value) })
      //   updateMessages(el)
      // })
    }
  }
  return { errors, vValidate }
}
