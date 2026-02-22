<template>
  <WgTableWithFilters @action:update-data="getList" />
</template>

<script setup lang="ts">
const { getList } = useAdminModule();

await getList();
</script>

<style scoped></style>
