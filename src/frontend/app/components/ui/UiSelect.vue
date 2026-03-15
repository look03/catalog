<template>
  <div class="ui-select">
    <UiFieldLabel v-if="label" :label="label" class="ui-select__label" :required="required" />
    <USelect v-bind="$attrs" :model-value="modelValue" v-on="selectListeners" />
  </div>
</template>

<script setup lang="ts">
import type { Select } from '~/types/ui';

defineOptions({ name: 'UiSelect', inheritAttrs: false });

withDefaults(
  defineProps<{
    modelValue?: Select;
    label?: string;
    required?: boolean;
  }>(),
  { modelValue: undefined, label: undefined, required: false }
);

const emits = defineEmits<{
  (e: 'update:modelValue', value: Select): void;
}>();

const selectListeners = computed(() => ({
  'update:modelValue': (v: Select) => emits('update:modelValue', v)
}));
</script>

<style scoped lang="scss">
.ui-select {
  display: flex;
  flex-direction: column;

  &__select {
    width: 100%;
  }

  &__label {
    margin-bottom: 8px;
  }
}
</style>
