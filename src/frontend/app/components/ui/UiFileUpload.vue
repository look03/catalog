<template>
  <div class="ui-field">
    <UiFieldLabel v-if="label" :label="label" :required="required" />
    <div class="ui-file-upload__area">
      <div v-if="props.existingItems?.length" class="ui-file-upload__existing">
        <div
          v-for="item in props.existingItems"
          :key="item.id"
          class="ui-file-upload__existing-item"
          @mouseenter="hoveredId = item.id"
          @mouseleave="hoveredId = null"
        >
          <div class="ui-file-upload__existing-thumb-wrap">
            <img
              :src="item.url"
              :alt="`Изображение ${item.id}`"
              class="ui-file-upload__existing-thumb"
            />
          </div>
          <button
            v-if="props.removableExisting"
            type="button"
            class="ui-file-upload__existing-remove"
            :aria-label="props.removeLabel"
            @click="emit('remove-existing', item.id)"
          >
            ×
          </button>
          <Transition name="ui-file-upload__preview">
            <div
              v-show="hoveredId === item.id"
              class="ui-file-upload__existing-preview"
            >
              <img
                :src="item.url"
                :alt="`Изображение ${item.id}`"
                class="ui-file-upload__existing-preview-img"
              />
            </div>
          </Transition>
        </div>
      </div>
      <UFileUpload
        v-model="model"
        :accept="props.accept"
        :multiple="props.multiple"
        variant="area"
        layout="grid"
        class="ui-file-upload"
        v-bind="$attrs"
      />
    </div>
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

export type ExistingUploadItem = { id: number; url: string };

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
    /** Существующие изображения для режима редактирования (отображаются в uploader) */
    existingItems?: ExistingUploadItem[];
    /** Показывать кнопку удаления у существующих */
    removableExisting?: boolean;
    /** aria-label для кнопки удаления */
    removeLabel?: string;
  }>(),
  {
    label: undefined,
    required: false,
    accept: ACCEPT,
    multiple: true,
    formatsHint: undefined,
    existingItems: () => [],
    removableExisting: true,
    removeLabel: 'Удалить'
  }
);

const emit = defineEmits<{
  (e: 'remove-existing', id: number): void;
}>();

const model = defineModel<File[] | File | null>({ default: null });

const hoveredId = ref<number | null>(null);

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

.ui-file-upload__area {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 0.75rem;
  min-height: 8rem;
  padding: 1rem;
  border: 2px dashed var(--ui-color-gray-300, #cbd5e1);
  border-radius: 0.5rem;
  background: var(--ui-color-gray-50, #f8fafc);
}

.ui-file-upload__area :deep(.ui-file-upload) {
  flex: 1 1 auto;
  min-width: 12rem;
}

.ui-file-upload__existing {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.ui-file-upload__existing-item {
  position: relative;
  flex: 0 0 auto;
  width: 5rem;
  height: 5rem;
  border-radius: 0.375rem;
  overflow: visible;
  border: 1px solid var(--ui-color-gray-200);
}

.ui-file-upload__existing-thumb-wrap {
  position: absolute;
  inset: 0;
  border-radius: 0.25rem;
  overflow: hidden;
}

.ui-file-upload__existing-preview {
  position: absolute;
  bottom: calc(100% + 0.5rem);
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  padding: 0.5rem;
  background: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  pointer-events: none;
}

.ui-file-upload__existing-preview-img {
  display: block;
  max-width: 20rem;
  max-height: 20rem;
  width: auto;
  height: auto;
  object-fit: contain;
}

.ui-file-upload__preview-enter-active,
.ui-file-upload__preview-leave-active {
  transition: opacity 0.15s ease;
}

.ui-file-upload__preview-enter-from,
.ui-file-upload__preview-leave-to {
  opacity: 0;
}

.ui-file-upload__existing-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ui-file-upload__existing-remove {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  font-size: 1rem;
  line-height: 1;
  color: #fff;
  background: rgba(0, 0, 0, 0.6);
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.ui-file-upload__existing-remove:hover {
  background: rgba(220, 38, 38, 0.9);
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
