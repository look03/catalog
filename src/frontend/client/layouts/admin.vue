<template>
  <div class="admin-layout">
    <header class="admin-layout__header">
      <nav>
        <h1>Админка</h1>
      </nav>
      <ui-button :name="`${$t('auth.logout')}`" @click="logout" />
    </header>

    <main>
      <NuxtPage />
    </main>

    <footer>
      <p>© 2026 Моя компания</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { logout } = useAuthModule();
</script>

<style scoped lang="scss">
.admin-layout {
  &__header {
    display: flex;
    justify-content: space-between;
  }
}
</style>
