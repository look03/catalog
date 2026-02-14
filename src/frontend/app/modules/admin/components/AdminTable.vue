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
import type { CatalogProduct, ProductHeaders } from '../types';

const emits = defineEmits<{
  (e: 'action:change-page', page: number): void;
}>();

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

const columns = computed<TableColumn<object, unknown>[]>(() => {
  return Object.entries(props.tableHeaders || {}).map(([key, header]) => ({
    accessorKey: key,
    header: header as string
  }));
});

/** Ключи колонок, в которых показывать ссылку (заголовок «Детальная страница»). */
const linksKeys = computed(() => {
  const headers = props.tableHeaders || {};
  return Object.entries(headers)
    .filter(([headerKey, _]) => headerKey === 'paths')
    .map(([key]) => key);
});

const sectionsKeys = computed(() => {
  const headers = props.tableHeaders || {};
  return Object.entries(headers)
    .filter(([headerKey, _]) => headerKey === 'sections')
    .map(([key]) => key);
});

function getDetailLink(product: CatalogProduct): string {
  const path = product.paths?.[0] ?? product.sections?.[0]?.pathDetail ?? '';
  return path || `/admin/product/${product.id}`;
}

function getDetailLabel(product: CatalogProduct): string {
  return product.sections?.[0]?.name ?? product.name ?? 'Перейти';
}
</script>

<style scoped lang="scss"></style>
