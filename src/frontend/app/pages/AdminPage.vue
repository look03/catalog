<template>
  <WgTableWithFilters
    :table-data="tableData"
    :total="total"
    :table-headers="tableHeaders"
    :limit="limit"
    :page="page"
    @action:update-data="getList"
  />
</template>

<script setup lang="ts">
const { getList, total, tableData, tableHeaders, limit, page } = useAdminModule();

await getList();
</script>

<style scoped></style>
