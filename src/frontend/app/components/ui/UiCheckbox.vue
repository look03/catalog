<template>
  <div class="ui-field ui-field--checkbox">
    <label class="ui-checkbox">
      <UCheckbox
        :model-value="checked"
        class="ui-checkbox__input"
        v-bind="$attrs"
        @update:model-value="onChange"
      />
      <span v-if="label" class="ui-checkbox__label">{{ label }}</span>
    </label>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'UiCheckbox', inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    modelValue?: boolean;
    label?: string;
  }>(),
  { modelValue: false, label: undefined }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const checked = computed(() => Boolean(props.modelValue));

function onChange(value: boolean | 'indeterminate') {
  emit('update:modelValue', value === true);
}
</script>

<style scoped lang="scss">
.ui-field--checkbox {
  display: flex;
  align-items: center;
}

.ui-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  cursor: pointer;
  user-select: none;
}

.ui-checkbox__input {
  flex-shrink: 0;
}

.ui-checkbox__label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
  line-height: 1.4;
}
</style>
