<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-card__tabs">
        <button
          type="button"
          class="auth-card__tab"
          :class="{ 'auth-card__tab--active': tab === 'login' }"
          @click="tab = 'login'"
        >
          {{ $t('auth.signIn') }}
        </button>
        <button
          type="button"
          class="auth-card__tab"
          :class="{ 'auth-card__tab--active': tab === 'register' }"
          @click="tab = 'register'"
        >
          {{ $t('auth.register') }}
        </button>
      </div>
      <div class="auth-card__content">
        <WgAuth v-if="tab === 'login'" />
        <WgRegister v-if="tab === 'register'" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const tab = ref<'login' | 'register'>('login');
</script>

<style scoped lang="scss">
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: #f8fafc;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.auth-card__tabs {
  display: flex;
  border-bottom: 1px solid #e2e8f0;
  background: #fff;
}

.auth-card__tab {
  flex: 1;
  padding: 1rem 1.25rem;
  font-size: 0.9375rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: #64748b;
  background: #fff;
  border: none;
  cursor: pointer;
  transition:
    color 0.2s ease,
    background 0.2s ease;

  &:hover:not(.auth-card__tab--active) {
    color: #334155;
    background: #f1f5f9;
  }

  &--active {
    color: #f8fafc;
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);

    &:hover {
      color: #f8fafc;
      background: linear-gradient(135deg, #273548 0%, #475569 100%);
    }
  }
}

.auth-card__content {
  padding: 1.75rem 1.5rem;
}

.auth-card__content :deep(.wg-auth),
.auth-card__content :deep(.wg-register) {
  h2 {
    margin: 0 0 1.25rem;
    font-size: 1.125rem;
    font-weight: 700;
    color: #334155;
    letter-spacing: 0.02em;
  }

  label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #475569;
  }

  input {
    padding: 0.65rem 0.75rem;
    font-size: 0.9375rem;
    color: #334155;
    background: #fff;
    border-radius: 6px;
    outline: none;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;

    &::placeholder {
      color: #94a3b8;
    }

    &:hover {
      border-color: #cbd5e1;
    }

    &:focus {
      border-color: #334155;
      box-shadow: 0 0 0 2px rgba(51, 65, 85, 0.12);
    }
  }

  button[type='submit'] {
    margin-top: 0.5rem;
    padding: 0.65rem 1.25rem;
    font-size: 0.9375rem;
    font-weight: 600;
    color: #f8fafc;
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    border: none;
    border-radius: 6px;
    cursor: pointer;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    transition:
      opacity 0.2s ease,
      box-shadow 0.2s ease;

    &:hover {
      opacity: 0.92;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
    }
  }
}
</style>
