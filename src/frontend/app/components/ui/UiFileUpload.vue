<template>
  <div class="ui-field">
    <UiFieldLabel v-if="label" :label="label" :required="required" />
    <UFileUpload
      v-model="model"
      :accept="props.accept"
      :multiple="props.multiple"
      class="ui-file-upload"
      v-bind="$attrs"
    />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'UiFileUpload', inheritAttrs: false });

/** Допустимые форматы: jpg, jpeg, webp, pdf, gif */
const ACCEPT = '.jpg,.jpeg,.webp,.pdf,.gif';

const props = withDefaults(
  defineProps<{
    modelValue?: File[] | File | null;
    label?: string;
    required?: boolean;
    /** Строка accept для input (по умолчанию: jpg, jpeg, webp, pdf, gif) */
    accept?: string;
    multiple?: boolean;
  }>(),
  {
    label: undefined,
    required: false,
    accept: ACCEPT,
    multiple: true
  }
);

const model = defineModel<File[] | File | null>({ default: null });
</script>

<style scoped lang="scss">
.ui-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ui-file-upload {
  width: 100%;
}
</style>
