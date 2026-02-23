<template>
  <div class="ui-field">
    <UiFieldLabel v-if="label" :label="label" :required="required" />
    <UTextarea
      v-bind="$attrs"
      :model-value="modelValue"
      class="ui-textarea"
      v-on="inputListeners"
    />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'UiTextarea', inheritAttrs: false });

withDefaults(
  defineProps<{
    modelValue?: string;
    label?: string;
    required?: boolean;
  }>(),
  { modelValue: undefined, label: undefined, required: false }
);

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const inputListeners = computed(() => ({
  'update:modelValue': (v: string) => emits('update:modelValue', v)
}));
</script>

<style scoped lang="scss">
.ui-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ui-textarea {
  width: 100%;
}
</style>
