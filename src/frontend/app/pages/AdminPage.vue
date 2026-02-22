<template>
  <WgTableWithFilters
    @action:update-data="getList"
    @action:delete="deleteRow"
    @action:edit="onEditRow"
    @action:add="showAddAside"
  />
</template>

<script setup lang="ts">
const { getList, deleteRow } = useAdminModule();

await getList();

const onEditRow = (id: number) => {
  console.log(id, '<<<<<<<<<<<<<< 44444444');
};

const showAddAside = () => {
  console.log('<<<<<<<<<<<<<< 44444444');
};
</script>

<style scoped></style>
