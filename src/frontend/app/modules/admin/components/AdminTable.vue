<template>
  <UiTablePagination
    v-if="tableData?.length"
    :data="tableData"
    :columns="columns"
    :total="total"
    :limit="props.limit"
    :page="props.page"
    @action:change-page="emits('action:change-page', $event)"
  >
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
  </UiTablePagination>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';
import type { CatalogProduct, OrderType, ProductHeaders, Sort, SortType } from '../types';
const UButton = resolveComponent('UButton');
const emits = defineEmits<{
  (e: 'action:change-page', page: number): void;
  (e: 'action:change-sort', payload: Sort): void;
}>();

const props = withDefaults(
  defineProps<{
    tableData: CatalogProduct[] | undefined;
    tableHeaders: ProductHeaders | undefined;
    total: number;
    limit: number;
    page: number;
    sort: SortType;
    order: OrderType;
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
  return Object.entries(props.tableHeaders || {}).map(([key, header]) => {
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
});
</script>

<style scoped lang="scss"></style>
