<template>
  <div class="wg-register">
    <h2>{{ $t('register.register') }}</h2>
    <form @submit.prevent="handleRegister">
      <label>
        {{ $t('email') }}
        <input v-model="registerEmail" type="email" required />
      </label>
      <label>
        {{ $t('password') }}
        <input v-model="registerPassword" type="password" required />
      </label>
      <label>
        {{ $t('register.confirmPassword') }}
        <input v-model="registerPasswordConfirm" type="password" required />
      </label>
      <button type="submit">{{ $t('register.toRegister') }}</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const { register } = useAuthModule();

const registerEmail = ref('');
const registerPassword = ref('');
const registerPasswordConfirm = ref('');

const handleRegister = async () => {
  if (registerPassword.value !== registerPasswordConfirm.value) {
    alert('Пароли не совпадают');
    return;
  }

  await register(registerEmail.value, registerPassword.value);
};
</script>

<style scoped lang="scss">
.wg-register {
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
