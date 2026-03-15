<template>
  <div class="wg-register">
    <h2>{{ $t('register.register') }}</h2>
    <form class="wg-register__form" @submit.prevent="handleRegister">
      <UiInput v-model="registerEmail" :label="$t('email')" type="email" required />
      <UiInputPassword v-model="registerPassword" :label="$t('password')" required />
      <UiInputPassword
        v-model="registerPasswordConfirm"
        :label="$t('register.confirmPassword')"
        required
      />
      <UiButton type="submit" class="register-form__submit" :name="$t('register.toRegister')" />
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

  &__form :deep(.ui-input),
  &__form :deep(.ui-input-password) {
    margin-bottom: 1rem;
  }

  &__form :deep(.ui-field-label) {
    font-weight: 600;
  }

  &__form :deep(.ui-input),
  &__form :deep(.ui-input-password),
  &__form :deep(input) {
    font-size: 1rem;
  }

  &__form :deep(input) {
    border-radius: 4px;
  }

  &__form :deep(.ui-input__trailing) {
    padding-right: 0.375rem;
  }

  &__form :deep(.ui-input__clear) {
    margin: 0;
    width: 1.5rem;
    height: 1.5rem;
    padding: 0.25rem;
  }

  &__form :deep(.ui-input__clear-icon) {
    font-size: 1.25rem;
  }

  &__form :deep(.register-form__submit) {
    padding: 0.5rem;
    background-color: #0070f3;
    border: none;
    color: white;
    font-weight: 700;
    cursor: pointer;
    border-radius: 4px;
  }

  &__form :deep(.register-form__submit:hover) {
    background-color: #005bb5;
  }
}
</style>
