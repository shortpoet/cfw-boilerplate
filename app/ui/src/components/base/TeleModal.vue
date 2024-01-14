<script setup lang="ts">
import Modal from './Modal.vue'
import { ref } from 'vue'

const showModal = ref(false)
</script>

<template>
  <div class="modal-trigger" @click="showModal = true">
    <slot name="trigger">
      <button bg-green id="show-modal">Show Modal</button>
    </slot>
  </div>

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
