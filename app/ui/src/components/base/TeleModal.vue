<script setup lang="ts">
import Modal from './Modal.vue'
import { ref } from 'vue'

const showModal = ref(false)
</script>

<template>
  <button bg-green id="show-modal" @click="showModal = true">Show Modal</button>

  <Teleport to="#teleport-target">
    <!-- use the modal component, pass in the prop -->
    <Modal :show="showModal" @close="showModal = false">
      <template #header>
        <slot name="header"></slot>
      </template>
      <template #body>
        <slot name="body"></slot>
      </template>
      <template #footer>
        <slot name="footer"></slot>
      </template>
    </Modal>
  </Teleport>
</template>
