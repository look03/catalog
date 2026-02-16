<template>
  <div class="ui-switcher-filter">
    <span v-if="props.label" class="ui-switcher-filter__label">{{ props.label }}:</span>
    <div class="ui-switcher-filter__buttons">
      <UiButton
        v-for="(tab, index) in props.tabs"
        :key="getTabValue(tab, index)"
        :color="isSelected(tab, index) ? 'primary' : 'neutral'"
        :variant="isSelected(tab, index) ? 'solid' : 'outline'"
        size="sm"
        :name="tab.label"
        @click="selectTab(tab, index)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TabItemBase } from '~/types';

const emits = defineEmits<{
  (e: 'action:switch', value: string | number): void;
}>();

const props = withDefaults(
  defineProps<{
    label?: string;
    tabs: TabItemBase[];
    modelValue?: string | number;
  }>(),
  {
    tabs: () => []
  }
);

const getTabValue = (tab: TabItemBase, index: number): string | number => {
  return tab.value ?? index;
};

const isSelected = (tab: TabItemBase, index: number): boolean => {
  const value = getTabValue(tab, index);
  return props.modelValue !== undefined && props.modelValue === value;
};

const selectTab = (tab: TabItemBase, index: number) => {
  emits('action:switch', getTabValue(tab, index));
};
</script>

<style scoped lang="scss">
.ui-switcher-filter {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &__label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--ui-text-muted, #64748b);
  }

  &__buttons {
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
</style>
