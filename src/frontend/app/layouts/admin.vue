<template>
  <div class="admin-layout">
    <header class="admin-layout__header">
      <NuxtLink to="/admin" class="admin-layout__brand">
        <span class="admin-layout__brand-icon" aria-hidden="true">◇</span>
        <span class="admin-layout__brand-text">Админка</span>
      </NuxtLink>
      <div class="admin-layout__user">
        <span v-if="appStore.user.email" class="admin-layout__email">
          {{ appStore.user.email }}
        </span>
        <LazyUiButton :name="$t('auth.logout')" @click="logoutAction" />
      </div>
    </header>

    <main class="admin-layout__main">
      <NuxtPage />
    </main>

  </div>
</template>

<script setup lang="ts">
const { logout } = useAuthModule();
const appStore = useAppStore();
const { getUserData } = useAdminModule();

await getUserData();

const logoutAction = async () => {
  await logout();
};
</script>

<style scoped lang="scss">
.admin-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    color: #f8fafc;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  }

  &__brand {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: inherit;
    text-decoration: none;
    font-weight: 700;
    font-size: 1.125rem;
    letter-spacing: 0.02em;

    &:hover {
      color: #cbd5e1;
    }
  }

  &__brand-icon {
    opacity: 0.9;
    font-size: 1.25rem;
  }

  &__brand-text {
    letter-spacing: 0.03em;
  }

  &__user {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  &__email {
    max-width: 14rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0.35rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #f1f5f9;
    background-color: rgba(255, 255, 255, 0.12);
    border-radius: 6px;
  }

  &__main {
    flex: 1;
    padding: 1.5rem;
  }

  &__footer {
    margin-top: auto;
    padding: 1rem 1.5rem;
    background-color: #f1f5f9;
    border-top: 1px solid #e2e8f0;
    color: #64748b;
    font-size: 0.875rem;
  }

  &__footer-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    max-width: 80rem;
    margin: 0 auto;
  }

  &__copyright {
    margin: 0;
  }

  &__footer-links a {
    color: inherit;
    text-decoration: none;

    &:hover {
      color: #334155;
      text-decoration: underline;
    }
  }
}
</style>
