<template>
  <div class="auth-container">
    <div class="tabs">
      <button
        :class="{ active: tab === 'login' }"
        @click="tab = 'login'"
      >
        Вход
      </button>
      <button
        :class="{ active: tab === 'register' }"
        @click="tab = 'register'"
      >
        Регистрация
      </button>
    </div>

    <div v-if="tab === 'login'" class="form-wrapper">
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
        <button type="submit">Войти</button>
      </form>
    </div>

    <div v-if="tab === 'register'" class="form-wrapper">
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
  </div>
</template>

<script setup>
import { ref } from 'vue';

const tab = ref('login');

const loginEmail = ref('');
const loginPassword = ref('');

const registerEmail = ref('');
const registerPassword = ref('');
const registerPasswordConfirm = ref('');

function handleLogin() {
  // Здесь можно сделать вызов API для входа
  alert(`Вход: ${loginEmail.value}, пароль: ${loginPassword.value}`);
}

function handleRegister() {
  if (registerPassword.value !== registerPasswordConfirm.value) {
    alert('Пароли не совпадают');
    return;
  }
  // Здесь можно сделать вызов API для регистрации
  alert(`Регистрация: ${registerEmail.value}`);
}
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.tabs button {
  flex: 1;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border: none;
  background: #eee;
  font-weight: 600;
  transition: background-color 0.3s;
}

.tabs button.active {
  background: #0070f3;
  color: white;
}

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
