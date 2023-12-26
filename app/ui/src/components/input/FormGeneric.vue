<template>
  <div>
    <form @submit.prevent="onSubmit" flex flex-col>
      <input
        :class="hidden ? 'hidden' : 'generic-input'"
        v-for="input in inputs"
        :type="input.type"
        v-model="input.value"
        :placeholder="input.placeholder"
      />
      <slot name="submit-button">
        <button class="btn-main" type="submit">Submit</button>
      </slot>
    </form>
  </div>
</template>

<style scoped>
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
<script setup lang="ts" generic="T extends FormInput">
export type FormInput = {
  key: string
  type: string
  value: string
  placeholder: string
}

const emit = defineEmits<{
  (event: 'submit', value: { [key: string]: string }): void
}>()

const props = defineProps({
  inputs: {
    required: true,
    default() {
      return [] as FormInput[]
    }
  },
  hidden: {
    required: false,
    default() {
      return false
    }
  },
  onSubmit: {
    required: false,
    default() {
      return (payload: Event) => {
        console.log(`[FormGeneric] onSubmit ${payload}`)
      }
    }
  }
})

const inputs = ref(props.inputs)
const onSubmit = (event: Event) => {
  console.log(`[FormGeneric] onSubmit ${event}`)
  emit(
    'submit',
    inputs.value.reduce(
      (acc, input) => {
        acc[input.key] = input.value
        return acc
      },
      {} as { [key: string]: string }
    )
  )
}

// if (validate.isError) {
//   throw 'This will trigger the upstream error boundary.'
// }
</script>
