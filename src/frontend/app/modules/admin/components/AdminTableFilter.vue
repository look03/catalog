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
        <div class="admin-table-filter__field">
          <UiSelect
            :model-value="props.filters.active ?? undefined"
            :label="$t('filter.active')"
            :items="selectActiveItems"
            value-key="value"
            label-key="label"
            :placeholder="$t('filter.placeholderActive')"
            size="md"
            class="admin-table-filter__select"
            @update:model-value="setFilter('active', $event as boolean | undefined)"
          />
        </div>
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

const emits = defineEmits<{
  (e: 'action:search' | 'input:clear-filters'): void;
  (e: 'input:table-type', value: TableType): void;
  (e: 'input:set-filters', field: keyof AdminFilters, value: string | boolean | undefined): void;
}>();

const props = withDefaults(
  defineProps<{
    filters: AdminFilters;
    tableType?: TableType;
  }>(),
  {
    tableType: 'products'
  }
);

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

const selectActiveItems = ref([
  {
    label: 'Все',
    value: undefined
  },
  {
    label: 'Активные',
    value: 'true'
  },
  {
    label: 'Неактивные',
    value: 'false'
  }
]);

const setFilter = (field: keyof AdminFilters, value: string | boolean | undefined) => {
  emits('input:set-filters', field, value);
};

const setTableType = (type: TableType) => {
  if (type !== props.tableType) {
    emits('input:table-type', type);
    onSearch();
  }
};

const onSearch = () => {
  emits('action:search');
};

const clearFilters = () => {
  emits('input:clear-filters');
  onSearch();
};
</script>

<style scoped lang="scss">
$border: #e2e8f0;

.admin-table-filter {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;

  &__card {
    padding: 1.5rem 1.5rem 1.25rem;
    background: #fff;
    border: 1px solid $border;
    border-radius: 6px;
    box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.04),
      0 4px 12px rgba(0, 0, 0, 0.05);
  }

  &__row {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: 1.25rem;
  }

  &__filters {
    margin-bottom: 1.25rem;
    padding-bottom: 1.25rem;
    border-bottom: 1px solid $border;
  }

  &__field {
    flex: 1;
    min-width: 140px;
    max-width: 220px;
  }

  &__select {
    width: 100%;
  }

  &__actions {
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  &__submit-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__btn-clear {
    transition:
      opacity 0.2s ease,
      background 0.2s ease;

    &:hover {
      opacity: 1;
    }
  }
}
</style>
