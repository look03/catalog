<template>
  <USlideover :open="open" :title="asideTitle" @update:open="emits('action:close')">
    <template #body>
      <AdminSectionForm
        v-if="tableType === 'sections'"
        ref="sectionFormRef"
        :section-items="sectionOptions"
        @action:save-section="emits('action:save-section', $event)"
        @action:update-section="updateSection"
      />
      <AdminProductForm
        v-else
        ref="productFormRef"
        :section-items="sectionOptions"
        :brand-items="brandSelectItems"
        @action:save-product="emits('action:save-product', $event)"
        @action:update-product="updateProduct"
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
import type { ProductForm, SectionForm, TableType, BrandOption, SectionOption } from '../types';
import AdminSectionForm from '~/modules/admin/components/form/AdminSectionForm.vue';
import AdminProductForm from '~/modules/admin/components/form/AdminProductForm.vue';
import AdminFormActions from '~/modules/admin/components/form/AdminFormActions.vue';
import { getSectionsForSelect, getBrands } from '../api';

const props = withDefaults(
  defineProps<{
    open?: boolean;
    tableType: TableType;
    loadingForm?: boolean;
    editIdItem?: number;
  }>(),
  {
    open: false,
    loadingForm: false,
    editIdItem: undefined
  }
);

const emits = defineEmits<{
  (e: 'success' | 'action:close'): void;
  (e: 'action:save-section', payload: SectionForm): void;
  (e: 'action:update-section', id: number, payload: SectionForm): void;
  (e: 'action:save-product', payload: ProductForm): void;
  (e: 'action:update-product', id: number, payload: ProductForm): void;
}>();

const sectionFormRef = ref<InstanceType<typeof AdminSectionForm> | null>(null);
const productFormRef = ref<InstanceType<typeof AdminProductForm> | null>(null);

const sectionOptions = ref<SectionOption[]>([]);
const brandOptions = ref<BrandOption[]>([]);

const { t } = useI18n();

const asideTitle = computed(() => {
  if (props.editIdItem) {
    return props.tableType === 'products'
      ? `${t('formProduct.editProduct')} ${props.editIdItem}`
      : `${t('formSection.editSection')} ${props.editIdItem}`;
  }
  return props.tableType === 'products' ? 'Добавить товар' : 'Добавить раздел';
});

const footerCancelLabel = computed(() =>
  props.tableType === 'sections' ? t('formSection.buttonCancel') : t('formProduct.buttonCancel')
);
const footerSubmitLabel = computed(() => {
  if (props.editIdItem) {
    return props.tableType === 'sections'
      ? t('formSection.buttonUpdateSection')
      : t('formProduct.buttonUpdateProduct');
  }

  return props.tableType === 'sections'
    ? t('formSection.buttonAddSection')
    : t('formProduct.buttonAddProduct');
});

const onFooterSubmit = () => {
  const formEl =
    props.tableType === 'sections' ? sectionFormRef.value?.$el : productFormRef.value?.$el;
  if (formEl?.requestSubmit) {
    formEl.requestSubmit();
  }
};

const updateSection = (id: number, payload: SectionForm) => {
  emits('action:update-section', id, payload);
};

const updateProduct = (id: number, payload: ProductForm) => {
  emits('action:update-product', id, payload);
};

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
</script>
