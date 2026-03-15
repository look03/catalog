<template>
  <div class="wg-auth">
    <h2>{{ $t('auth.signIn') }}</h2>
    <form class="wg-auth__form" @submit.prevent="handleLogin">
      <UiInput
        :model-value="loginEmail"
        :label="$t('email')"
        type="email"
        required
        :error="emailError"
        @update:model-value="onEmailUpdate"
      />
      <UiInputPassword
        :model-value="loginPassword"
        :label="$t('password')"
        required
        :error="passwordError"
        @update:model-value="onPasswordUpdate"
      />
      <UiButton type="submit" class="auth-form__submit" :name="$t('auth.login')" />
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '../stores/authStore';

const { t } = useI18n();
const { login } = useAuthModule();
const authStore = useAuthStore();
const { loginError } = storeToRefs(authStore);

const loginEmail = ref('');
const loginPassword = ref('');
const submitted = ref(false);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const wrongCredentialsMessage = computed(() =>
  loginError?.value ? t('auth.wrongCredentials') : undefined
);

const emailError = computed(() => {
  if (!submitted.value && !loginEmail.value) {
    return wrongCredentialsMessage.value;
  }

  if (!loginEmail.value.trim()) {
    return t('auth.emailRequired');
  }

  if (!EMAIL_REGEX.test(loginEmail.value.trim())) {
    return t('auth.emailInvalid');
  }

  return wrongCredentialsMessage.value;
});

const passwordError = computed(() => {
  if (!submitted.value && !loginPassword.value) {
    return wrongCredentialsMessage.value;
  }

  if (!loginPassword.value) {
    return t('auth.passwordRequired');
  }

  return wrongCredentialsMessage.value;
});

function onEmailUpdate(value: string | number | undefined) {
  loginEmail.value = value !== undefined && value !== null ? String(value) : '';
  authStore.clearLoginError();
}

function onPasswordUpdate(value: string | undefined) {
  loginPassword.value = value ?? '';
  authStore.clearLoginError();
}

const validate = (): boolean => {
  const trimmed = loginEmail.value.trim();
  const emailValid = !!trimmed && EMAIL_REGEX.test(trimmed);
  const passwordValid = !!loginPassword.value;
  return emailValid && passwordValid;
};

const handleLogin = async () => {
  submitted.value = true;
  if (!validate()) {
    return;
  }

  await login(loginEmail.value.trim(), loginPassword.value);
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
