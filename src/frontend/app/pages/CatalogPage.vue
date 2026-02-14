<template>
  <div class="catalog-page"></div>
</template>

<script setup lang="ts">
const { getCatalogData } = useCatalogModule();
const route = useRoute();
await getCatalogData(route.path);
</script>

<style scoped></style>
