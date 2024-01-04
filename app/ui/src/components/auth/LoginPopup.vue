<template>
  <div>
    <button @click="showLoginModal = true">Open Login</button>

    <!-- Modal -->
    <div v-if="showLoginModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="showLoginModal = false">&times;</span>
        <h2>Login</h2>
        <form @submit.prevent="login">
          <input type="text" v-model="username" placeholder="Username" />
          <br />
          <input type="email" v-model="email" placeholder="Email" />
          <br />
          <input type="password" v-model="password" placeholder="Password" />
          <br />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LoginOptions } from '#/types';


const showLoginModal = ref(false);
const username = ref('');
const password = ref('');
const email = ref('');
const loginOpts = {
  type: 'oauth',
  provider: 'google'
  username: username.value,
  password: password.value,
  email: email.value
}

const emit = defineEmits<{
  (event: 'login', value: LoginOptions): void
}>()

const login = () => {
  // Perform login logic here
  console.log('Logging in with:', loginOpts);

  // Reset the form after login
  emit('login', loginOpts)
  username.value = '';
  password.value = '';
  email.value = '';
  // Close the modal
  showLoginModal.value = false;
};

export { showLoginModal, username, password, login };
</script>

<style scoped>
/* Styles for modal */
.modal {
  display: none;
  /* Hidden by default */
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 400px;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>
