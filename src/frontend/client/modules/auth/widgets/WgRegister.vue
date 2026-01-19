<template>
  <div class="form-wrapper">
    <h2>Регистрация</h2>
    <form @submit.prevent="handleRegister">
      <label>
        Email:
        <input type="email" v-model="registerEmail" required />
      </label>
      <label>
        Пароль:
        <input type="password" v-model="registerPassword" required />
      </label>
      <label>
        Подтверждение пароля:
        <input type="password" v-model="registerPasswordConfirm" required />
      </label>
      <button type="submit">Зарегистрироваться</button>
    </form>
  </div>
</template>

<script setup lang="ts">

import { ref } from 'vue';

const registerEmail = ref('');
const registerPassword = ref('');
const registerPasswordConfirm = ref('');


function handleRegister() {
  if (registerPassword.value !== registerPasswordConfirm.value) {
    alert('Пароли не совпадают');
    return;
  }
  // Здесь можно сделать вызов API для регистрации
  alert(`Регистрация: ${registerEmail.value}`);
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
