<template>
  <AdminTable
    :table-data="props.tableData"
    :total="props.total"
    :table-headers="props.tableHeaders"
    :limit="props.limit"
    :page="props.page"
    @action:change-page="changePage"
  />
</template>

<script setup lang="ts">
import AdminTable from '../components/AdminTable.vue';

import type { CatalogProduct, ProductHeaders } from '../types';
import { useAdminStore } from '../stores/adminStore';

const emits = defineEmits<{
  (e: 'action:update-data'): void;
}>();

const adminStore = useAdminStore();

const props = withDefaults(
  defineProps<{
    tableData: CatalogProduct[] | undefined;
    tableHeaders: ProductHeaders | undefined;
    total: number;
    limit: number;
    page: number;
  }>(),
  {
    tableData: undefined,
    tableHeaders: undefined,
    total: 0,
    limit: 0,
    page: 1
  }
);

const changePage = (page: number): void => {
  adminStore.setPage(page);
  emits('action:update-data');
};
</script>

<style scoped lang="scss">
.form-wrapper {
  display: flex;
  flex-direction: column;
}

form label {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  font-weight: 600;
}

input {
  padding: 0.5rem;
  font-size: 1rem;
  margin-top: 0.25rem;
}

button[type='submit'] {
  padding: 0.5rem;
  background-color: #0070f3;
  border: none;
  color: white;
  font-weight: 700;
  cursor: pointer;
  border-radius: 4px;
}

button[type='submit']:hover {
  background-color: #005bb5;
}
</style>
