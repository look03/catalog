<template>
  <div class="wg-table-with-filters">
    <AdminTableFilter @action:search="onSearch" />
    <AdminTable
      :table-data="adminStore.tableData"
      :total="adminStore.total"
      :table-headers="adminStore.tableHeaders"
      :limit="adminStore.limit"
      :page="adminStore.page"
      :sort="adminStore.sort"
      :order="adminStore.order"
      @action:change-page="changePage"
      @action:change-sort="changeSort"
    />
  </div>
</template>

<script setup lang="ts">
import AdminTable from '../components/AdminTable.vue';
import AdminTableFilter from '../components/AdminTableFilter.vue';
import { useAdminStore } from '../stores/adminStore';
import type { Sort } from '~/modules/admin/types';

const emits = defineEmits<{
  (e: 'action:update-data'): void;
}>();

const adminStore = useAdminStore();

const onSearch = () => {
  emits('action:update-data');
};

const changeSort = (payload: Sort): void => {
  adminStore.setSort(payload);
  emits('action:update-data');
};

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
