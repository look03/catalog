<template>
  <div class="w-full space-y-4 pb-4">
    <UTable
      ref="table"
      :data="props.data"
      :columns="props.columns"
      :pagination-options="{
        getPaginationRowModel: getPaginationRowModel()
      }"
      class="flex-1 ui-table-with-dividers"
    >
      <template v-for="(_, slotName) in $slots" :key="String(slotName)" #[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps" />
      </template>
    </UTable>

    <div class="flex justify-end border-t border-default pt-4 px-4 ui-pagination-stable">
      <UPagination
        :page="page"
        :items-per-page="props.limit"
        :total="total"
        @update:page="(p) => updatePage(p)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';
import { getPaginationRowModel } from '@tanstack/vue-table';

const table = useTemplateRef('table');

const emits = defineEmits<{
  (e: 'action:change-page', page: number): void; // TODO - AN
}>();

const props = withDefaults(
  defineProps<{
    data?: object[];
    columns?: TableColumn<object, unknown>[];
    total?: number;
    limit?: number;
    page?: number;
  }>(),
  {
    data: () => []
  }
);

const updatePage = (page: number): void => {
  emits('action:change-page', page);
  return table.value?.tableApi?.setPageIndex(page - 1);
};
</script>

<style scoped lang="scss">
$table-border: var(--ui-border, #e5e7eb);

/* Вертикальные разделители между столбцами */
:deep(th:not(:last-child)),
:deep(td:not(:last-child)) {
  border-right: 1px solid $table-border;
}

/* Шапка таблицы: фон и линия снизу */
:deep(thead th) {
  background-color: var(--ui-table-header-bg, #f1f5f9);
  color: var(--ui-table-header-color, #334155);
  font-weight: 600;
  border-top: 1px solid $table-border;
}
</style>
