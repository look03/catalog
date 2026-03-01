<template>
  <form class="admin-form admin-form--product" @submit.prevent="onSubmit">
    <UiInput
      v-model="form.title"
      :label="$t('formProduct.nameProduct')"
      required
      :placeholder="$t('formProduct.nameProductPlaceholder')"
      size="md"
    />
    <UiInput
      v-model.number="form.price"
      :label="$t('formProduct.price')"
      required
      min="0"
      step="0.01"
      size="md"
    />
    <UiSelectMenu
      v-model="form.section_ids"
      :label="$t('formProduct.sections')"
      required
      :items="sectionItems"
      value-key="id"
      label-key="name"
      multiple
      :placeholder="$t('formProduct.sectionsPlaceholder')"
      size="md"
    />
    <div class="admin-form__row">
      <UiInput
        v-model="form.color"
        :label="$t('formProduct.color')"
        :placeholder="$t('formProduct.colorPlaceholder')"
        size="md"
        maxlength="7"
      />
      <div class="admin-form__brand-wrap">
        <UiSelect
          v-model="form.brand_id"
          :label="$t('formProduct.brand')"
          :items="brandItems"
          value-key="id"
          label-key="name"
          :placeholder="$t('formProduct.brandPlaceholder')"
          size="md"
        />
      </div>
    </div>
    <UiTextarea
      v-model="form.preview_text"
      :label="$t('formProduct.previewText')"
      :placeholder="$t('formProduct.previewPlaceholder')"
      :rows="3"
      size="md"
    />
    <UiFileUpload v-model="files" :label="$t('formProduct.images')" />
  </form>
</template>

<script setup lang="ts">
import type { PayloadProduct, SelectOption } from '~/modules/admin/types';

const props = withDefaults(
  defineProps<{
    sectionItems?: SelectOption[];
    brandItems?: SelectOption[];
  }>(),
  { sectionItems: () => [], brandItems: () => [] }
);

const emits = defineEmits<{
  (e: 'submit', payload: PayloadProduct): void;
}>();

const defaultForm = {
  title: '',
  price: 0,
  section_ids: [],
  color: '',
  preview_text: '',
  brand_id: undefined
};

const form = ref(defaultForm);

const files = ref<File[] | File | null>(null);

const onSubmit = () => {
  if (!form.value.title?.trim() || form.value.section_ids.length === 0) {
    return;
  }
  if (Number(form.value.price) < 0) {
    return;
  }

  const fileList = Array.isArray(files.value) ? files.value : files.value ? [files.value] : [];
  emits('submit', {
    title: form.value.title.trim(),
    price: Number(form.value.price),
    section_ids: form.value.section_ids,
    color: form.value.color?.trim() ?? '',
    preview_text: form.value.preview_text?.trim() ?? '',
    brand_id: form.value.brand_id,
    files: fileList
  });
};

const reset = () => {
  form.value = defaultForm;
  files.value = null;
};

defineExpose({ reset });
</script>

<style scoped lang="scss">
.admin-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 0.25rem 0;
}

.admin-form__row {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.admin-form__brand-wrap {
  flex: 0 0 12rem;
  width: 12rem;
  min-width: 12rem;

  :deep(.ui-field),
  :deep(.ui-select),
  :deep(button),
  :deep([role='combobox']) {
    width: 100% !important;
    min-width: 100% !important;
    box-sizing: border-box;
  }
}
</style>
