<template>
  <div class="admin-panel-header">
    <h1 class="admin-panel-header__title">{{ $t('panel.title') }}</h1>
    <UiButton color="primary" :label="addButtonLabel" @click="$emit('action:add')" />
  </div>
</template>

<script setup lang="ts">
import type { TableType } from '../types';

const props = defineProps<{
  tableType: TableType;
}>();

defineEmits<{
  (e: 'action:add'): void;
}>();

const { t } = useI18n();

const addButtonLabel = computed(() =>
  props.tableType === 'products' ? t('panel.addProduct') : t('panel.addSection')
);
</script>

<style scoped lang="scss">
.admin-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2rem;
}

.admin-panel-header__title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--ui-text, #334155);
}
</style>
