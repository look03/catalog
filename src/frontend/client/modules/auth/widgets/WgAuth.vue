<template>
  <div class="form-wrapper">
    <h2>Вход</h2>
    <form @submit.prevent="handleLogin">
      <label>
        Email:
        <input type="email" v-model="loginEmail" required />
      </label>
      <label>
        Пароль:
        <input type="password" v-model="loginPassword" required />
      </label>
      <button type="submit">{{$t('auth.login')}}</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const loginEmail = ref('');
const loginPassword = ref('');

function handleLogin() {
  // Здесь можно сделать вызов API для входа
  alert(`Вход: ${loginEmail.value}, пароль: ${loginPassword.value}`);
}

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
