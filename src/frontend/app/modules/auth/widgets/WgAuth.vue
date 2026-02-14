<template>
  <div class="form-wrapper">
    <h2>{{ $t('auth.signIn') }}</h2>
    <form @submit.prevent="handleLogin">
      <label>
        {{ $t('email') }}
        <input v-model="loginEmail" type="email" required />
      </label>
      <label>
        {{ $t('password') }}
        <input v-model="loginPassword" type="password" required />
      </label>
      <button type="submit">{{ $t('auth.login') }}</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const { login } = useAuthModule();

const loginEmail = ref('');
const loginPassword = ref('');

const handleLogin = async () => {
  if (!loginEmail.value && !loginPassword.value) {
    return;
  }

  await login(loginEmail.value, loginPassword.value);
};
</script>

<style scoped lang="scss">
.form-wrapper {
  display: flex;
  flex-direction: column;
}

form label {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  font-weight: 600;
}

input {
  padding: 0.5rem;
  font-size: 1rem;
  margin-top: 0.25rem;
}

button[type='submit'] {
  padding: 0.5rem;
  background-color: #0070f3;
  border: none;
  color: white;
  font-weight: 700;
  cursor: pointer;
  border-radius: 4px;
}

button[type='submit']:hover {
  background-color: #005bb5;
}
</style>
