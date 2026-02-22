<template>
  <div class="wg-table-with-filters">
    <AdminPanelHeader :table-type="adminStore.tableType" @action:add="onAdd" />
    <AdminTableFilter @action:search="onSearch" />
    <AdminTable
      :table-data="tableData"
      :total="adminStore.total"
      :table-headers="tableHeaders"
      :limit="adminStore.limit"
      :page="adminStore.page"
      :sort="adminStore.sort"
      :order="adminStore.order"
      @action:change-page="changePage"
      @action:change-sort="changeSort"
      @action:delete="openDeleteModal"
      @action:edit="onEditRow"
    />
    <AdminDeleteModal
      :open="deleteModalOpen"
      :title="deleteModalTitle"
      :item-name="itemToDelete?.name"
      @close="closeDeleteModal"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import AdminTable from '../components/AdminTable.vue';
import AdminDeleteModal from '../components/AdminDeleteModal.vue';
import AdminPanelHeader from '../components/AdminPanelHeader.vue';
import AdminTableFilter from '../components/AdminTableFilter.vue';
import { useAdminStore } from '../stores/adminStore';
import type { CatalogProduct, CatalogSection, Sort } from '~/modules/admin/types';

const emits = defineEmits<{
  (e: 'action:update-data' | 'action:add'): void;
  (e: 'action:delete' | 'action:edit', id: number): void;
}>();

const { t } = useI18n();
const adminStore = useAdminStore();

const deleteModalTitle = computed(() =>
  adminStore.tableType === 'products' ? t('delete.product') : t('delete.section')
);

const deleteModalOpen = ref(false);
const itemToDelete = ref<CatalogProduct | CatalogSection | null>(null);

const tableData = computed(() =>
  adminStore.tableType === 'products' ? adminStore.tableProductsData : adminStore.tableSectionsData
);

const tableHeaders = computed(() =>
  adminStore.tableType === 'products'
    ? adminStore.tableProductsHeaders
    : adminStore.tableSectionsHeaders
);

const onSearch = () => {
  emits('action:update-data');
};

const onAdd = () => {
  emits('action:add');
};

const openDeleteModal = (row: CatalogProduct | CatalogSection) => {
  itemToDelete.value = row;
  deleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  deleteModalOpen.value = false;
  itemToDelete.value = null;
};

const confirmDelete = () => {
  if (itemToDelete.value) {
    emits('action:delete', itemToDelete.value.id);
    closeDeleteModal();
  }
};

const onEditRow = (id: number) => {
  emits('action:edit', id);
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
