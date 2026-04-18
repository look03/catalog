<template>
  <div class="catalog-layout">
    <WgCatalogSiteHeader />
    <main class="catalog-layout__main">
      <NuxtPage />
    </main>
    <WgCatalogSiteFooter />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'CatalogLayout' });
</script>

<style scoped lang="scss">
.catalog-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8fafc;

  &__main {
    flex: 1;
    width: 100%;
  }
}
</style>
