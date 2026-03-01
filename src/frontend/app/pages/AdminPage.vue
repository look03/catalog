<template>
  <WgTableWithFilters
    @action:update-data="getList"
    @action:delete="deleteRow"
    @action:show-edit-form="openEditForm"
    @action:save-section="createSection"
    @action:update-section="updateSection"
    @action:save-product="createProduct"
  />
</template>

<script setup lang="ts">
const { getList, deleteRow, createSection, createProduct, openEditForm, updateSection } =
  useAdminModule();

await getList();
</script>

<style scoped></style>
