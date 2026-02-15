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
        <div class="admin-table-filter__toggle">
          <span class="admin-table-filter__toggle-label">Таблица:</span>
          <div class="admin-table-filter__toggle-buttons">
            <UButton
              :color="adminStore.tableType === 'products' ? 'primary' : 'neutral'"
              :variant="adminStore.tableType === 'products' ? 'solid' : 'outline'"
              size="sm"
              label="Продукты"
              @click="setTableType('products')"
            />
            <UButton
              :color="adminStore.tableType === 'sections' ? 'primary' : 'neutral'"
              :variant="adminStore.tableType === 'sections' ? 'solid' : 'outline'"
              size="sm"
              label="Секции"
              @click="setTableType('sections')"
            />
          </div>
        </div>
        <UButton color="primary" icon="i-lucide-search" label="Найти" size="md" @click="onSearch" />
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

const { filters } = storeToRefs(adminStore);

const setFilter = (field: keyof AdminFilters, value: string) => {
  adminStore.setFilters({
    [field]: value
  });
};

const setTableType = (type: TableType) => {
  adminStore.setTableType(type);
  emits('action:search');
};

function onSearch() {
  emits('action:search');
}
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

  &__toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--ui-text-muted, #64748b);
    }

    &-buttons {
      display: inline-flex;
      gap: 0;
      border-radius: 6px;
      overflow: hidden;
      box-shadow: 0 0 0 1px var(--ui-border, #e2e8f0);

      button {
        border-radius: 0;
        border: none;
        box-shadow: none;
      }
      button:first-child {
        border-radius: 6px 0 0 6px;
      }
      button:last-child {
        border-radius: 0 6px 6px 0;
      }
    }
  }
}
</style>
