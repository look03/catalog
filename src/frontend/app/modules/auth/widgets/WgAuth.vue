<template>
  <div class="wg-auth">
    <h2>{{ $t('auth.signIn') }}</h2>
    <form class="wg-auth__form" @submit.prevent="handleLogin">
      <UiInput v-model="loginEmail" :label="$t('email')" type="email" required />
      <UiInputPassword v-model="loginPassword" :label="$t('password')" required />
      <UiButton type="submit" class="auth-form__submit" :name="$t('auth.login')" />
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
.wg-auth {
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
    padding-right: 0;
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

  &__form :deep(.auth-form__submit) {
    padding: 0.5rem;
    background-color: #0070f3;
    border: none;
    color: white;
    font-weight: 700;
    cursor: pointer;
    border-radius: 4px;
  }

  &__form :deep(.auth-form__submit:hover) {
    background-color: #005bb5;
  }
}
</style>
