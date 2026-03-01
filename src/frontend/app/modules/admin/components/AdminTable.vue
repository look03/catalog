<template>
  <UiTablePagination
    card-class="admin-table"
    :data="tableData ?? []"
    :columns="columns"
    :total="total"
    :limit="props.limit"
    :page="props.page"
    @action:change-page="emits('action:change-page', $event)"
    @action:change-limit="emits('action:change-limit', $event)"
  >
    <template #icons-cell="{ row }">
      <div class="admin-table__actions">
        <UiButton
          color="neutral"
          variant="ghost"
          size="xs"
          icon="i-lucide-pencil"
          class="admin-table__action-btn"
          @click="
            emits('action:show-edit-form', (row.original as CatalogProduct | CatalogSection).id)
          "
        />
        <UiButton
          color="neutral"
          variant="ghost"
          size="xs"
          icon="i-lucide-x"
          class="admin-table__action-btn admin-table__action-btn--delete"
          @click="emits('action:delete', row.original as CatalogProduct | CatalogSection)"
        />
      </div>
    </template>
    <template #[`paths-cell`]="{ row }">
      <div class="flex flex-col">
        <UiLink
          v-for="(item, key) in (row.original as CatalogProduct).paths"
          :key="`${key}-link`"
          :to="item"
          :name="item"
        />
      </div>
    </template>
    <template #[`sections-cell`]="{ row }">
      <div class="flex flex-col">
        <UiLink
          v-for="(item, key) in (row.original as CatalogProduct).sections"
          :key="`${key}-link`"
          :to="item.path"
          :name="item.name"
        />
      </div>
    </template>
    <template #[`parentSection-cell`]="{ row }">
      <div v-if="(row.original as CatalogSection).parentSection" class="flex flex-col">
        <UiLink
          :to="(row.original as CatalogSection).parentSection?.path"
          :name="(row.original as CatalogSection).parentSection?.name"
        />
      </div>
    </template>
  </UiTablePagination>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';
import type {
  CatalogProduct,
  CatalogSection,
  OrderType,
  ProductHeaders,
  SectionHeaders,
  Sort,
  SortType
} from '../types';
const UButton = resolveComponent('UButton');
const emits = defineEmits<{
  (e: 'action:change-page' | 'action:show-edit-form' | 'action:change-limit', value: number): void;
  (e: 'action:change-sort', payload: Sort): void;
  (e: 'action:delete', row: CatalogProduct | CatalogSection): void;
}>();

const props = withDefaults(
  defineProps<{
    tableData?: CatalogProduct[] | CatalogSection[] | undefined;
    tableHeaders?: ProductHeaders | SectionHeaders | undefined;
    total?: number;
    limit?: number;
    page?: number;
    sort?: SortType;
    order?: OrderType;
  }>(),
  {
    tableData: undefined,
    tableHeaders: undefined,
    total: 0,
    limit: 0,
    page: 1,
    sort: 'id',
    order: 'asc'
  }
);

const sortedColumn = ref('');

const columns = computed<TableColumn<object, unknown>[]>(() => {
  const headers = Object.entries(props.tableHeaders || {}).map(([key, header]) => {
    if (['id', 'active', 'name', 'createdAt', 'updatedAt'].includes(key)) {
      const isSorted = sortedColumn.value === key;
      return {
        accessorKey: key,
        header: () => {
          return h(
            UButton,
            {
              color: 'neutral',
              variant: 'ghost',
              class: 'admin-table__sort-btn',
              onClick: () => {
                sortedColumn.value = key;
                emits('action:change-sort', {
                  sort: key as SortType,
                  order: props.order === 'asc' ? 'desc' : 'asc'
                });
              }
            },
            {
              default: () => [
                header,
                h('span', { class: 'admin-table__sort' }, [
                  h(
                    'span',
                    {
                      class: [
                        'admin-table__sort-arrow',
                        'admin-table__sort-arrow--up',
                        isSorted && props.order === 'asc' && 'admin-table__sort-arrow--active'
                      ]
                    },
                    '▲'
                  ),
                  h(
                    'span',
                    {
                      class: [
                        'admin-table__sort-arrow',
                        'admin-table__sort-arrow--down',
                        isSorted && props.order === 'desc' && 'admin-table__sort-arrow--active'
                      ]
                    },
                    '▼'
                  )
                ])
              ]
            }
          );
        }
      };
    }

    return {
      accessorKey: key,
      header: header as string
    };
  });

  headers.unshift({
    accessorKey: 'icons',
    header: ''
  });

  return headers;
});
</script>

<style scoped lang="scss">
$border: #e2e8f0;
$hover-bg: #f1f5f9;

:deep(.admin-table) {
  border-radius: 12px;
  border: 1px solid $border;
  background: #fff;
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.04),
    0 4px 12px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.admin-table__actions {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.admin-table__action-btn {
  padding: 0.4rem;
  border-radius: 8px;
  border: 1px solid transparent;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    transform 0.15s ease;

  &:hover {
    background: #f1f5f9;
    border-color: #e2e8f0;
    transform: scale(1.05);
  }

  &--delete:hover {
    background: #fef2f2;
    border-color: #fecaca;
  }
}
</style>
