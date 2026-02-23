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
    <div v-if="formatsHint || formatList.length" class="ui-file-upload__formats">
      <p v-if="formatsHint" class="ui-file-upload__hint">{{ formatsHint }}</p>
      <div v-else class="ui-file-upload__badges">
        <span class="ui-file-upload__badges-label">Форматы:</span>
        <span
          v-for="ext in formatList"
          :key="ext"
          class="ui-file-upload__badge"
        >{{ ext }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'UiFileUpload', inheritAttrs: false });

const ACCEPT = '.jpg,.jpeg,.webp,.pdf,.gif,.png';

const props = withDefaults(
  defineProps<{
    modelValue?: File[] | File | null;
    label?: string;
    required?: boolean;
    /** Строка accept для input (по умолчанию: jpg, jpeg, webp, pdf, gif, png) */
    accept?: string;
    multiple?: boolean;
    /** Текст подсказки с форматами (если не задан — выводятся бейджи по accept) */
    formatsHint?: string;
  }>(),
  {
    label: undefined,
    required: false,
    accept: ACCEPT,
    multiple: true,
    formatsHint: undefined
  }
);

const model = defineModel<File[] | File | null>({ default: null });

const formatList = computed(() => {
  if (props.formatsHint !== undefined && props.formatsHint !== '') {
    return [];
  }
  return (
    props.accept
      ?.split(',')
      .map((s) => s.trim().replace(/^\./, '').toUpperCase())
      .filter(Boolean) ?? []
  );
});

const formatsHint = computed(() =>
  props.formatsHint !== undefined && props.formatsHint !== '' ? props.formatsHint : ''
);
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

.ui-file-upload__formats {
  margin-top: 0.25rem;
}

.ui-file-upload__hint {
  margin: 0;
  font-size: 0.8125rem;
  color: var(--ui-text-secondary, #64748b);
  line-height: 1.4;
}

.ui-file-upload__badges {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem 0.5rem;
}

.ui-file-upload__badges-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--ui-text-secondary, #64748b);
  letter-spacing: 0.01em;
}

.ui-file-upload__badge {
  display: inline-block;
  padding: 0.2em 0.5em;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--ui-color-primary, #3b82f6);
  background: color-mix(in srgb, var(--ui-color-primary, #3b82f6) 12%, transparent);
  border-radius: 6px;
}
</style>
