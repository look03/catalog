<template>
  <WgTableWithFilters
    @action:update-data="getList"
    @action:delete="deleteRow"
    @action:edit="onEditRow"
    @action:save-section="createSection"
    @action:save-product="createProduct"
  />
</template>

<script setup lang="ts">
const { getList, deleteRow, createSection, createProduct } = useAdminModule();

await getList();

const onEditRow = (id: number) => {
  console.log(id, '<<<<<<<<<<<<<< 44444444');
};
</script>

<style scoped></style>
