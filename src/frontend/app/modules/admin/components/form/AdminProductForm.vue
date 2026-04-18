<template>
  <form class="admin-form admin-form--product" @submit.prevent="onSubmit">
    <UiCheckbox v-if="editIdItem" v-model="productForm.active" :label="$t('formProduct.active')" />
    <UiInput
      :model-value="productForm.title"
      :label="$t('formProduct.nameProduct')"
      required
      :placeholder="$t('formProduct.nameProductPlaceholder')"
      size="md"
      :error="titleError"
      @update:model-value="onTitleUpdate"
    />
    <UiInput
      type="number"
      :model-value="priceInputValue"
      :label="$t('formProduct.price')"
      required
      min="0"
      step="0.01"
      size="md"
      :error="priceError"
      @update:model-value="onPriceUpdate"
    />
    <UiSectionTreeSelect
      v-model="productForm.section_ids"
      :label="$t('formProduct.sections')"
      required
      multiple
      :show-no-parent="false"
      :items="props.sectionItems"
      :placeholder="$t('formProduct.sectionsPlaceholder')"
      :error="sectionsError"
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
      required
      :existing-items="existingUploadItems"
      :removable-existing="!!editIdItem"
      :remove-label="$t('modal.delete')"
      :error="imagesError"
      @remove-existing="removeExistingImage"
    />
  </form>
</template>

<script setup lang="ts">
import { useAdminStore } from '../../stores/adminStore';
import type { ProductForm } from '~/modules/admin/types';

export type SectionTreeItem = {
  id: number;
  name: string;
  title?: string;
  parentSectionId?: number | null;
};

const props = withDefaults(
  defineProps<{
    sectionItems?: SectionTreeItem[];
    brandItems?: { id: number; name: string }[];
  }>(),
  { sectionItems: () => [], brandItems: () => [] }
);

const emits = defineEmits<{
  (e: 'action:save-product', payload: ProductForm): void;
  (e: 'action:update-product', id: number, payload: ProductForm): void;
}>();

const { t } = useI18n();
const config = useRuntimeConfig();
const adminStore = useAdminStore();
const { productForm, editIdItem } = storeToRefs(adminStore);

const submitted = ref(false);
const MIN_TITLE_LENGTH = 3;

const files = ref<File[] | File | null>(null);
const removedImageIds = ref<number[]>([]);

const normalizeFiles = (file: File[] | File | null): File[] => {
  if (!file) {
    return [];
  }

  return Array.isArray(file) ? file : [file];
};

const displayedImages = computed(() =>
  (productForm.value.images ?? []).filter((img) => !removedImageIds.value.includes(img.id))
);

const priceInputValue = computed(() => {
  const price = productForm.value.price;
  if (typeof price === 'number' && Number.isNaN(price)) {
    return '';
  }

  return price;
});

const titleError = computed(() => {
  const title = productForm.value.title ?? '';
  const trimmed = title.trim();
  if (!submitted.value && !trimmed) {
    return undefined;
  }

  if (!trimmed) {
    return t('formProduct.nameProductRequired');
  }

  if (trimmed.length < MIN_TITLE_LENGTH) {
    return t('formProduct.nameProductMinLength');
  }

  return undefined;
});

const priceError = computed(() => {
  const price = productForm.value.price;
  const isEdit = !!editIdItem.value;

  if (!submitted.value) {
    if (!isEdit && typeof price === 'number' && Number.isFinite(price) && price === 0) {
      return undefined;
    }
    if (isEdit && typeof price === 'number' && Number.isFinite(price) && price >= 0) {
      return undefined;
    }
    if (!isEdit && typeof price === 'number' && Number.isFinite(price) && price > 0) {
      return undefined;
    }
  }

  if (typeof price !== 'number' || !Number.isFinite(price)) {
    return t('formProduct.priceRequired');
  }

  if (price < 0) {
    return t('formProduct.priceNegative');
  }

  if (!isEdit && price === 0) {
    return t('formProduct.priceRequired');
  }

  return undefined;
});

const sectionsError = computed(() => {
  const ids = productForm.value.section_ids ?? [];
  if (!submitted.value && ids.length === 0) {
    return undefined;
  }

  if (ids.length === 0) {
    return t('formProduct.sectionsRequired');
  }

  return undefined;
});

const imagesError = computed(() => {
  const hasNew = normalizeFiles(files.value).length > 0;
  const hasExisting = displayedImages.value.length > 0;
  if (!submitted.value && !hasNew && !hasExisting) {
    return undefined;
  }

  if (!hasNew && !hasExisting) {
    return t('formProduct.imagesRequired');
  }

  return undefined;
});

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

const onTitleUpdate = (value: string | number | undefined) => {
  productForm.value.title = value !== undefined && value !== null ? String(value) : '';
};

const onPriceUpdate = (value: string | number | undefined) => {
  if (value === undefined || value === '') {
    productForm.value.price = NaN;
    return;
  }
  const n = Number(value);
  productForm.value.price = Number.isFinite(n) ? n : NaN;
};

const validate = (): boolean => {
  const trimmed = productForm.value.title?.trim() ?? '';
  const titleOk = trimmed.length >= MIN_TITLE_LENGTH;
  const p = productForm.value.price;
  const isEdit = !!editIdItem.value;
  const priceFinite = typeof p === 'number' && Number.isFinite(p);
  const priceOk = priceFinite && p >= 0 && (isEdit || p > 0);
  const sectionsOk = (productForm.value.section_ids?.length ?? 0) > 0;
  const imagesOk = normalizeFiles(files.value).length > 0 || displayedImages.value.length > 0;
  return titleOk && priceOk && sectionsOk && imagesOk;
};

const onSubmit = () => {
  submitted.value = true;
  if (!validate()) {
    return;
  }

  const fileList = normalizeFiles(files.value);
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
  submitted.value = false;
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
