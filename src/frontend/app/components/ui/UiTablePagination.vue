<template>
  <p v-if="total !== undefined" class="u-table-pagination__summary">{{ summaryText }}</p>
  <div :class="['u-table-pagination w-full', props.cardClass]">
    <template v-if="isEmpty">
      <div class="u-table-pagination__empty">
        <UIcon name="i-lucide-search-x" class="u-table-pagination__empty-icon" aria-hidden="true" />
        <p class="u-table-pagination__empty-text">Ничего не найдено</p>
      </div>
    </template>
    <template v-else>
      <UTable
        ref="table"
        :data="props.data"
        :columns="props.columns"
        :pagination-options="paginationOptions"
        class="flex-1 ui-table-with-dividers"
      >
        <template v-for="(_, slotName) in $slots" :key="String(slotName)" #[slotName]="slotProps">
          <slot :name="slotName" v-bind="slotProps" />
        </template>
      </UTable>

      <div class="u-table-pagination__bar">
        <div class="u-table-pagination__limit">
          <label class="u-table-pagination__limit-label">На странице:</label>
          <USelect
            :model-value="props.limit"
            :items="limitOptions"
            size="sm"
            class="u-table-pagination__limit-select"
            @update:model-value="onLimitChange"
          />
        </div>
        <div v-if="showPagination" class="u-table-pagination__nav ui-pagination-stable">
          <UPagination
            :page="page"
            :items-per-page="props.limit"
            :total="total"
            @update:page="(p) => updatePage(p)"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';
import { getPaginationRowModel } from '@tanstack/vue-table';

const table = useTemplateRef('table');

const emits = defineEmits<{
  (e: 'action:change-page' | 'action:change-limit', page: number): void;
}>();

const props = withDefaults(
  defineProps<{
    data?: object[];
    columns?: TableColumn<object, unknown>[];
    total?: number;
    limit?: number;
    page?: number;
    cardClass?: string;
  }>(),
  {
    data: () => [],
    columns: undefined,
    total: undefined,
    limit: undefined,
    page: undefined,
    cardClass: undefined
  }
);

const limitOptions = [10, 25, 50, 100];

const paginationOptions = computed(() => ({
  getPaginationRowModel: getPaginationRowModel(),
  initialState: {
    pagination: {
      pageSize: props.limit ?? 10,
      pageIndex: 0
    }
  }
}));

const summaryText = computed(() => {
  const t = props.total ?? 0;
  if (t === 0) {
    return '';
  }

  const limit = props.limit || 1;
  const page = props.page || 1;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, t);
  const n = to - from + 1;

  return `Записей на странице ${n} из ${t}`;
});

const isEmpty = computed(() => (props.total ?? 0) === 0);

const showPagination = computed(() => {
  const t = props.total ?? 0;
  const limit = props.limit || 1;
  return t > limit;
});

const onLimitChange = (value: number) => {
  if (value != null && !Number.isNaN(Number(value)) && Number(value) > 0) {
    emits('action:change-limit', Number(value));
  }
};

const updatePage = (page: number): void => {
  emits('action:change-page', page);
  return table.value?.tableApi?.setPageIndex(page - 1);
};
</script>

<style scoped lang="scss">
$table-border: #e2e8f0;
$header-bg: #f8fafc;
$header-text: #475569;
$row-hover: #f1f5f9;
$cell-text: #334155;
$muted: #64748b;

.u-table-pagination__summary {
  margin: 0 0 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: $muted;
  letter-spacing: 0.01em;
}

.u-table-pagination {
  :deep(tr[data-slot='separator']) {
    display: none;
  }

  :deep([data-slot='leadingIcon']) {
    cursor: pointer;
  }

  :deep(table) {
    border-collapse: separate;
    border-spacing: 0;
  }

  :deep(th:not(:last-child)),
  :deep(td:not(:last-child)) {
    border-right: 1px solid $table-border;
  }

  :deep(thead) {
    border-bottom: none;
  }

  :deep(thead th) {
    background: #f4f6f8;
    color: $header-text;
    font-weight: 600;
    font-size: 0.9375rem;
    letter-spacing: 0.025em;
    text-transform: none;
    border-top: none;
    border-bottom: 1px solid $table-border;
    padding: 1.125rem 1.25rem;
    white-space: nowrap;
  }

  :deep(tbody td) {
    padding: 0.875rem 1rem;
    font-size: 0.875rem;
    color: $cell-text;
    border-bottom: 1px solid $table-border;
    transition: background-color 0.15s ease;
  }

  :deep(tbody tr:last-child td) {
    border-bottom: none;
  }

  :deep(tbody tr:hover td) {
    background: $row-hover;
  }

  /* Кнопки сортировки в шапке */
  :deep(.admin-table__sort-btn) {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.35rem 0.5rem;
    margin: -0.35rem -0.5rem;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition:
      background 0.2s ease,
      color 0.2s ease;
  }

  :deep(.admin-table__sort) {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0;
    margin-left: 0.3rem;
    line-height: 1;
  }

  :deep(.admin-table__sort-arrow) {
    display: block;
    font-size: 0.5rem;
    color: #94a3b8;
    transition: color 0.2s ease;
  }

  :deep(.admin-table__sort-arrow--active) {
    color: #475569;
  }

  :deep(.admin-table__sort-btn:hover .admin-table__sort-arrow) {
    color: #64748b;
  }

  :deep(.admin-table__sort-btn:hover .admin-table__sort-arrow--active) {
    color: #334155;
  }

  .ui-pagination-stable :deep(nav a),
  .ui-pagination-stable :deep(nav button) {
    cursor: pointer;
  }
}

.u-table-pagination__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 3rem 1.5rem;
  text-align: center;
}

.u-table-pagination__empty-icon {
  width: 2.5rem;
  height: 2.5rem;
  color: #cbd5e1;
}

.u-table-pagination__empty-text {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 500;
  color: $muted;
}

.u-table-pagination__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-top: 1px solid $table-border;
  padding: 0.875rem 1rem 0.875rem 1rem;
  margin: 0 1rem 0.875rem;
  background: transparent;
}

.u-table-pagination__limit {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.u-table-pagination__limit-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: $muted;
  white-space: nowrap;
}

.u-table-pagination__limit-select {
  padding: 0.4rem 0.6rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: $cell-text;
  background: #fff;
  border: 1px solid $table-border;
  border-radius: 8px;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    border-color: #cbd5e1;
  }

  &:focus {
    outline: none;
    border-color: #94a3b8;
    box-shadow: 0 0 0 2px rgba(148, 163, 184, 0.2);
  }
}
</style>
