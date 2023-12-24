<template>
  <a :class="classStyle">
    <slot />
  </a>
</template>
<style scoped>
a {
  padding: 0.25rem 0.25rem;
  margin: 0rem 0.25rem;
  /* margin-left: -10px; */
}

a.active {
  background-color: rgb(130, 94, 130);
  border-radius: 0.25rem;
}
</style>
<script lang="ts" setup>
import clsx from 'clsx';

const props = defineProps({
  active: {
    type: Boolean,
    required: false,
    default: () => undefined
  }
})
const attrs = useAttrs()
const classStyle = computed(() => {
  return clsx({
    active: props.active ?? pageContext.urlPathname === attrs.href
  })
}
)

const pageContext = usePageContext()
</script>
