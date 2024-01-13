<template>
  <div>
    <div flex flex-row @click="toggleForm">
      <div :class="formContainerClass" />
      <span class="form-title">Show {{ title }}</span>
    </div>
    <form @submit.prevent="onSubmit" flex flex-col :class="formDisplayClass">
      <input
        class="generic-input"
        v-for="input in inputs"
        :type="input.type"
        v-model="input.value"
        :placeholder="input.placeholder"
        :key="input.key"
        :required="input.required"
        v-validate="`required|${input.type}`"
      />
      <slot name="submit-button">
        <button class="btn-main" type="submit">Submit</button>
      </slot>
    </form>
  </div>
</template>

<style scoped>
.form-icon {
  cursor: pointer;
  /* margin: auto; */
  margin-bottom: 10px;
  width: 2.5em;
  height: 2.5em;
  display: 'inline-block';
  /* border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  text-align: center;
  line-height: 20px; */
}

.form-title {
  font-size: 16px;
  font-weight: bold;
  padding: 0.5em;
}
.hidden {
  display: none;
}

.generic-form {
  display: flex;
  flex-direction: column;
  width: 300px;
  /* Adjust width as needed */
  margin: auto;
  /* Center the form horizontally */
}

.generic-input {
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

/* Add more styles for inputs, like focus and hover effects */

.generic-input:focus {
  outline: none;
  border-color: #2196f3;
  /* Change the border color on focus */
}

/* Add hover effect */
.generic-input:hover {
  border-color: #999;
  /* Change the border color on hover */
}
</style>
<script setup lang="ts" generic="T">
import { FormEmitValue, FormInput } from '#/types'

const showForm = ref(false)

const toggleForm = () => {
  showForm.value = !showForm.value
}

const formContainerClass = computed(() => ({
  'i-carbon-caret-down form-icon': !showForm.value,
  'i-carbon-caret-up form-icon': showForm.value
}))

const formDisplayClass = computed(() => {
  return {
    hidden: !showForm.value
  }
})

const { vValidate, errors } = useValidation()

const emit = defineEmits<{
  (event: 'submit', value: FormEmitValue<T>): void
}>()

const props = defineProps({
  inputs: {
    required: true,
    default() {
      return [] as FormInput<T>[]
    }
  },
  title: {
    required: false,
    default() {
      return 'Form'
    }
  },

  hidden: {
    required: false,
    default() {
      return false
    }
  },
  onSubmitCallback: {
    required: false,
    default() {
      return (payload: Event) => {
        console.log(`[FormGeneric] onSubmitCallback ${payload}`)
      }
    }
  }
})

const inputs = ref(props.inputs)
console.log(`[FormGeneric] inputs ${JSON.stringify(inputs.value)}`)
const onSubmit = (event: Event) => {
  console.log(`[FormGeneric] onSubmit event`)
  console.log(event)
  const inputValues = inputs.value.reduce((acc, input) => {
    acc[input.key as keyof T] = input.value
    return acc
  }, {} as T)
  console.log(`[FormGeneric] onSubmit inputValues`)
  console.log(inputValues)
  emit('submit', {
    form: inputValues,
    event
  })
}

watch(
  () => errors.value,
  (value) => {
    if (Object.entries(value).some(([key, value]) => value !== '')) {
      // console.log(`[FormGeneric] errors ${JSON.stringify(value)}`)
      throw new Error(`[FormGeneric] errors ${JSON.stringify(errors.value)}`)
    }
  }
)
</script>
