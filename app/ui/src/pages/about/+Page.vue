<template>
  <FlashMessage />

  <h1>About</h1>
  <p>Example of app using <code>Vike</code>.</p>
</template>

<script setup lang="ts">
// @ts-expect-error figure out why this works but is linted
import IconDataSuccess from '~icons/carbon/rocket'
onInfoFlash({
  title: 'Info Greeting',
  text: 'No suspense boundary - blank on refresh',
  duration: 5000,
  icon: markRaw(IconDataSuccess),
  show: true
})
</script>

<style>
code {
  font-family: monospace;
  background-color: #eaeaea;
  padding: 3px 5px;
  border-radius: 4px;
}
</style>
