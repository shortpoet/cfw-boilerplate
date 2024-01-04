<script setup lang="ts">
import { defineEmits } from 'vue'

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'action-1'): void
  (event: 'action-2'): void
  (event: 'action-3'): void
}>()
</script>
<template>
  <transition name="modal-fade">
    <div class="custom-modal-backdrop" @click="$emit('close')">
      <div
        class="custom-modal"
        role="dialog"
        aria-labelledby="modalTitle"
        aria-describedby="modalDescription"
      >
        <header class="custom-modal-header" id="modalTitle">
          <slot name="header">
            <h4 class="heading-pdf heading-4 me-auto">Save to PDF</h4>
            <button type="button" class="btn-ex" @click="$emit('close')" aria-label="Close modal">
              <font-awesome-icon icon="times" />
            </button>
          </slot>
        </header>
        <section class="custom-modal-body" id="modalDescription">
          <slot name="body">
            <p>Custom <em>modal</em> body here. As <b>you</b> see fit.</p>
            <p><span class="saveme-text">Save Me!</span> - actual aspect ratio.</p>
            <p><span class="pageme-text">Page Me!</span> - A4 format and pagination.</p>
          </slot>
        </section>
        <footer class="custom-modal-footer">
          <slot name="footer">
            <div class="button-drawer d-flex flex-row justify-content-around">
              <div>
                <button
                  type="button"
                  class="btn-action-1"
                  @click="$emit('action-1')"
                  aria-label="Action 1"
                >
                  Action 1
                </button>
              </div>
              <div>
                <button
                  type="button"
                  class="btn-action-2"
                  @click="$emit('action-2')"
                  aria-label="Action 2"
                >
                  Action 2
                </button>
              </div>
              <div>
                <button type="button" class="btn-return">
                  <a class="btn-return" href="/" aria-label="Close modal"> Home Page </a>
                </button>
              </div>
            </div>
          </slot>
        </footer>
      </div>
    </div>
  </transition>
</template>

<style lang="scss">
.custom-modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.custom-modal {
  background: #ffffff;
  box-shadow: 2px 2px 20px 1px;
  /* overflow-x: auto; */
  display: flex;
  flex-direction: column;
  max-width: 15rem;
}

.custom-modal-header {
  margin: 1.5rem 1.5rem 0rem 1.5rem;
  display: flex;
  border-bottom: 1px solid #eeeeee;
  /* justify-content: space-between; */
  font-family: 'Saira Extra Condensed';
}

.custom-modal-body {
  /* position: relative; */
  margin: 1.5rem 1.5rem 1.5rem 1.5rem;
  font-family: 'Open Sans';
}

.custom-modal-footer {
  margin: 0rem 1.5rem 1.5rem 1.5rem;
  padding: 1.5rem 0rem 0rem 0rem;
  border-top: 1px solid #eeeeee;
  font-family: 'Saira Extra Condensed';
  /* display: flex; */
  /* justify-content: flex-end; */
}

.button-drawer {
  display: flex;
  /* justify-content: space-around; */
}

.btn-ex {
  border: none;
  font-size: 1rem;
  padding: 0rem 0rem 0rem 0rem;
  margin: 0rem 0rem 0.5rem 0rem;
  cursor: pointer;
  font-weight: bold;
  color: $primary;
  background: transparent;
}

.btn-save {
  color: white;
  background: $forest-green;
  border: 1px solid $forest-green;
  border-radius: 0.25rem;
  font-family: 'Saira Extra Condensed';
}
.btn-return {
  color: white;
  background: $primary;
  border: 1px solid $primary;
  border-radius: 0.25rem;
  font-family: 'Saira Extra Condensed';
  &:hover {
    color: white;
    background: $primary;
    border: 1px solid $primary;
    text-decoration: none;
  }
  // width: auto;
  // height: auto;
}
.btn-page {
  color: white;
  background: $orange;
  border: 1px solid $orange;
  border-radius: 0.25rem;
  font-family: 'Saira Extra Condensed';
}

.saveme-text {
  color: $forest-green;
}
.pageme-text {
  color: $orange;
}
</style>
