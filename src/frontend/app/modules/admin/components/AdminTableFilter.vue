<template>
  <div class="admin-table-filter">
    <div class="admin-table-filter__card">
      <div class="admin-table-filter__row admin-table-filter__filters">
        <UiInputFilter
          :title="$t('filter.name')"
          :placeholder="$t('filter.placeholderName')"
          :value="filters.name"
          @action:input="setFilter('name', $event)"
          @action:on-search="onSearch"
        />
        <UiInputFilter
          :title="$t('filter.code')"
          :placeholder="$t('filter.placeholderCode')"
          :value="filters.code"
          @action:input="setFilter('code', $event)"
          @action:on-search="onSearch"
        />
        <UiInputFilter
          :title="$t('filter.id')"
          :placeholder="$t('filter.placeholderId')"
          :value="filters.id"
          @action:input="setFilter('id', $event)"
          @action:on-search="onSearch"
        />
      </div>
      <div class="admin-table-filter__row admin-table-filter__actions">
        <UiSwitcherFilter
          :label="$t('filter.table')"
          :tabs="tabs"
          :model-value="tableType"
          @action:switch="setTableType($event as TableType)"
        />
        <div class="admin-table-filter__submit-group">
          <UiButton
            color="neutral"
            variant="outline"
            icon="i-lucide-filter-x"
            :name="$t('filter.clear')"
            size="md"
            class="admin-table-filter__btn-clear"
            @click="clearFilters"
          />
          <UiButton
            color="primary"
            icon="i-lucide-search"
            size="md"
            :name="$t('filter.search')"
            @click="onSearch"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AdminFilters, TableType } from '../types';
import { useAdminStore } from '../stores/adminStore';
import { storeToRefs } from 'pinia';

const emits = defineEmits<{
  (e: 'action:search'): void;
}>();

const adminStore = useAdminStore();

const { filters, tableType } = storeToRefs(adminStore);

const tabs = [
  {
    label: 'Продукты',
    value: 'products'
  },
  {
    label: 'Разделы',
    value: 'sections'
  }
];

const setFilter = (field: keyof AdminFilters, value: string) => {
  adminStore.setFilters({
    [field]: value || undefined
  });
};

const setTableType = (type: TableType) => {
  adminStore.setTableType(type);
  emits('action:search');
};

const onSearch = () => {
  emits('action:search');
};

const clearFilters = () => {
  adminStore.clearFilters();
  emits('action:search');
};
</script>

<style scoped lang="scss">
.admin-table-filter {
  margin-top: 1.5rem;
  margin-bottom: 1.25rem;

  &__card {
    padding: 1.25rem;
    background: var(--ui-bg, #fff);
    border: 1px solid var(--ui-border, #e2e8f0);
    border-radius: 10px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  }

  &__row {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: 1rem;
  }

  &__filters {
    margin-bottom: 1rem;
  }

  &__actions {
    justify-content: space-between;
    padding-top: 0.5rem;
    border-top: 1px solid var(--ui-border, #e2e8f0);
  }

  &__submit-group {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__btn-clear {
    opacity: 0.9;

    &:hover {
      opacity: 1;
    }
  }
}
</style>
