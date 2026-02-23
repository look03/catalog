<template>
  <div>
    <UiTablePagination
      v-if="tableData?.length"
      :data="tableData"
      :columns="columns"
      :total="total"
      :limit="props.limit"
      :page="props.page"
      @action:change-page="emits('action:change-page', $event)"
    >
      <template #icons-cell="{ row }">
        <div class="admin-table__actions">
          <UiButton
            color="neutral"
            variant="ghost"
            size="xs"
            icon="i-lucide-pencil"
            class="admin-table__action-btn"
            @click="emits('action:edit', (row.original as CatalogProduct | CatalogSection).id)"
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
  </div>
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
  (e: 'action:change-page' | 'action:edit', value: number): void;
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
    if (['id', 'name', 'createdAt', 'updatedAt'].includes(key)) {
      return {
        accessorKey: key,
        header: () => {
          return h(UButton, {
            color: 'neutral',
            variant: 'ghost',
            label: header,
            icon:
              sortedColumn.value === key
                ? props.order === 'asc'
                  ? 'i-lucide-arrow-up-narrow-wide'
                  : 'i-lucide-arrow-down-wide-narrow'
                : 'i-lucide-arrow-up-down',
            class: '-mx-2.5',
            onClick: () => {
              sortedColumn.value = key;
              emits('action:change-sort', {
                sort: key as SortType,
                order: props.order === 'asc' ? 'desc' : 'asc'
              });
            }
          });
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
.admin-table__actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.admin-table__action-btn {
  padding: 0.25rem;
  border-radius: 6px;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.85;
  }

  &--delete {
    padding: 0.3rem;
  }
}
</style>
