<template>
  <form class="admin-form admin-form--product" @submit.prevent="onSubmit">
    <UiCheckbox v-if="editIdItem" v-model="productForm.active" :label="$t('formProduct.active')" />
    <UiInput
      v-model="productForm.title"
      :label="$t('formProduct.nameProduct')"
      required
      :placeholder="$t('formProduct.nameProductPlaceholder')"
      size="md"
    />
    <UiInput
      v-model.number="productForm.price"
      :label="$t('formProduct.price')"
      required
      min="0"
      step="0.01"
      size="md"
    />
    <UiSelectMenu
      v-model="productForm.section_ids"
      :label="$t('formProduct.sections')"
      required
      :items="props.sectionItems"
      value-key="id"
      label-key="name"
      multiple
      :placeholder="$t('formProduct.sectionsPlaceholder')"
      size="md"
    />
    <div class="admin-form__row">
      <UiInput
        v-model="productForm.color"
        :label="$t('formProduct.color')"
        :placeholder="$t('formProduct.colorPlaceholder')"
        size="md"
        maxlength="7"
      />
      <div class="admin-form__brand-wrap">
        <UiSelect
          v-model="productForm.brand_id"
          :label="$t('formProduct.brand')"
          :items="props.brandItems"
          value-key="id"
          label-key="name"
          :placeholder="$t('formProduct.brandPlaceholder')"
          size="md"
        />
      </div>
    </div>
    <UiTextarea
      v-model="productForm.preview_text"
      :label="$t('formProduct.previewText')"
      :placeholder="$t('formProduct.previewPlaceholder')"
      :rows="3"
      size="md"
    />
    <UiFileUpload
      v-model="files"
      :label="$t('formProduct.images')"
      :existing-items="existingUploadItems"
      :removable-existing="!!editIdItem"
      :remove-label="$t('modal.delete')"
      @remove-existing="removeExistingImage"
    />
  </form>
</template>

<script setup lang="ts">
import { useAdminStore } from '../../stores/adminStore';
import type { ProductForm, SelectOption } from '~/modules/admin/types';

const props = withDefaults(
  defineProps<{
    sectionItems?: SelectOption[];
    brandItems?: SelectOption[];
  }>(),
  { sectionItems: () => [], brandItems: () => [] }
);

const emits = defineEmits<{
  (e: 'action:save-product', payload: ProductForm): void;
  (e: 'action:update-product', id: number, payload: ProductForm): void;
}>();

const config = useRuntimeConfig();
const adminStore = useAdminStore();
const { productForm, editIdItem } = storeToRefs(adminStore);

const files = ref<File[] | File | null>(null);
const removedImageIds = ref<number[]>([]);

const displayedImages = computed(() =>
  (productForm.value.images ?? []).filter((img) => !removedImageIds.value.includes(img.id))
);

const imageUrl = (path: string) => {
  const apiBase = (config.public.apiBase as string)?.replace(/\/$/, '') || '';
  const normalizedPath = path.replace(/^\.\//, '').replace(/\\/g, '/');
  return `${apiBase}/${normalizedPath}`;
};

const existingUploadItems = computed(() =>
  displayedImages.value.map((img) => ({ id: img.id, url: imageUrl(img.path) }))
);

const removeExistingImage = (id: number) => {
  removedImageIds.value.push(id);
};

const onSubmit = () => {
  if (!productForm.value.title?.trim() || productForm.value.section_ids.length === 0) {
    return;
  }
  if (Number(productForm.value.price) < 0) {
    return;
  }

  const fileList = Array.isArray(files.value) ? files.value : files.value ? [files.value] : [];
  const payload: ProductForm = {
    title: productForm.value.title.trim(),
    price: Number(productForm.value.price),
    section_ids: productForm.value.section_ids,
    color: productForm.value.color?.trim() ?? '',
    preview_text: productForm.value.preview_text?.trim() ?? '',
    brand_id: productForm.value.brand_id,
    files: fileList,
    images: productForm.value.images ?? [],
    active: editIdItem.value
      ? (productForm.value.active ?? undefined)
      : (productForm.value.active ?? true),
    image_ids_to_remove: editIdItem.value ? removedImageIds.value : undefined
  };

  if (editIdItem.value) {
    emits('action:update-product', editIdItem.value, payload);
  } else {
    emits('action:save-product', payload as ProductForm);
  }
};

const reset = () => {
  adminStore.clearProductForm();
  files.value = null;
  removedImageIds.value = [];
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
