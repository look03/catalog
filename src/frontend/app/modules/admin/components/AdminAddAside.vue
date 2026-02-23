<template>
  <USlideover :open="open" :title="asideTitle" @update:open="emits('action:close')">
    <template #body>
      <AdminSectionForm
        v-if="tableType === 'sections'"
        ref="sectionFormRef"
        :section-items="sectionSelectItems"
        @submit="emits('action:save-section', $event)"
      />
      <AdminProductForm
        v-else
        ref="productFormRef"
        :section-items="productSectionItems"
        :brand-items="brandSelectItems"
        @submit="onProductSubmit"
      />
    </template>
    <template #footer>
      <AdminFormActions
        :cancel-label="footerCancelLabel"
        :submit-label="footerSubmitLabel"
        :loading="props.loadingForm"
        @cancel="emits('action:close')"
        @submit="onFooterSubmit"
      />
    </template>
  </USlideover>
</template>

<script setup lang="ts">
import type { PayloadSection, TableType } from '../types';
import AdminSectionForm from '~/modules/admin/components/form/AdminSectionForm.vue';
import AdminProductForm from '~/modules/admin/components/form/AdminProductForm.vue';
import AdminFormActions from '~/modules/admin/components/form/AdminFormActions.vue';
import {
  getSectionsForSelect,
  getBrands,
  createProduct,
  type BrandOption,
  type SectionOption
} from '../api';

const props = withDefaults(
  defineProps<{
    open?: boolean;
    tableType: TableType;
    loadingForm?: boolean;
  }>(),
  {
    open: false,
    loadingForm: false
  }
);

const emits = defineEmits<{
  (e: 'success' | 'action:close'): void;
  (e: 'action:save-section', payload: PayloadSection): void;
}>();

const sectionFormRef = ref<InstanceType<typeof AdminSectionForm> | null>(null);
const productFormRef = ref<InstanceType<typeof AdminProductForm> | null>(null);

const sectionOptions = ref<SectionOption[]>([]);
const brandOptions = ref<BrandOption[]>([]);

const { t } = useI18n();

const asideTitle = computed(() =>
  props.tableType === 'products' ? 'Добавить товар' : 'Добавить раздел'
);

const footerCancelLabel = computed(() =>
  props.tableType === 'sections' ? t('formSection.buttonCancel') : 'Отмена'
);
const footerSubmitLabel = computed(() =>
  props.tableType === 'sections' ? t('formSection.buttonAddSection') : 'Создать товар'
);

const onFooterSubmit = () => {
  const formEl =
    props.tableType === 'sections' ? sectionFormRef.value?.$el : productFormRef.value?.$el;
  if (formEl?.requestSubmit) {
    formEl.requestSubmit();
  }
};

const sectionSelectItems = computed(() =>
  sectionOptions.value.map((s) => ({ id: s.id, name: s.name }))
);

const productSectionItems = computed(() =>
  sectionOptions.value.map((s) => ({ id: s.id, name: s.name }))
);

const brandSelectItems = computed(() =>
  brandOptions.value.map((b) => ({ id: b.id, name: b.name }))
);

async function loadOptions() {
  const [sections, brands] = await Promise.all([getSectionsForSelect(), getBrands()]);
  sectionOptions.value = sections;
  brandOptions.value = brands;
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      loadOptions();
      sectionFormRef.value?.reset();
      productFormRef.value?.reset();
    }
  }
);

async function onProductSubmit(payload: {
  title: string;
  price: number;
  section_ids: number[];
  color: string;
  preview_text: string;
  brand_id: number | undefined;
  files: File[];
}) {
  try {
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('price', String(payload.price));
    formData.append('section_ids', JSON.stringify(payload.section_ids));
    if (payload.color) formData.append('color', payload.color);
    if (payload.preview_text) formData.append('preview_text', payload.preview_text);
    if (payload.brand_id != null && payload.brand_id > 0) {
      formData.append('brand_id', String(payload.brand_id));
    }
    payload.files.forEach((file) => formData.append('images', file));

    await createProduct(formData);
    emits('action:close');
    emits('success');
  } catch (err) {
    logError('ADMIN_CREATE_PRODUCT', 'POST', err);
  } finally {
  }
}
</script>
