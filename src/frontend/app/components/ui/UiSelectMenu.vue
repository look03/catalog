<template>
  <div class="ui-field">
    <UiFieldLabel v-if="label" :label="label" :required="required" />
    <USelectMenu
      v-bind="$attrs"
      :model-value="modelValue"
      class="ui-select-menu"
      v-on="menuListeners"
    />
  </div>
</template>

<script setup lang="ts">
import type { Select } from '~/types/ui';

defineOptions({ name: 'UiSelectMenu', inheritAttrs: false });

withDefaults(
  defineProps<{
    modelValue?: Select | Select[];
    label?: string;
    required?: boolean;
  }>(),
  { modelValue: undefined, label: undefined, required: false }
);

const emits = defineEmits<{
  (e: 'update:modelValue', value: Select | Select[]): void;
}>();

const menuListeners = computed(() => ({
  'update:modelValue': (v: Select | Select[]) => emits('update:modelValue', v)
}));
</script>

<style scoped lang="scss">
.ui-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ui-select-menu {
  width: 100%;
}
</style>
