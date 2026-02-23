<template>
  <label v-if="label" class="ui-field-label">
    {{ label }}
    <span v-if="required" class="ui-field-label__required">*</span>
  </label>
</template>

<script setup lang="ts">
defineOptions({ name: 'UiFieldLabel' });

withDefaults(
  defineProps<{
    label?: string;
    required?: boolean;
  }>(),
  { label: undefined, required: false }
);
</script>

<style scoped lang="scss">
.ui-field-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
}

.ui-field-label__required {
  color: var(--ui-error, #dc2626);
}
</style>
