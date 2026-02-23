<template>
  <form class="admin-form admin-form--product" @submit.prevent="onSubmit">
    <UiInput
      v-model="form.title"
      label="Название товара"
      required
      placeholder="Введите название"
      size="md"
    />
    <UiInput v-model.number="form.price" label="Цена" required min="0" step="0.01" size="md" />
    <UiSelectMenu
      v-model="form.section_ids"
      label="Разделы"
      required
      :items="sectionItems"
      value-key="id"
      label-key="name"
      multiple
      placeholder="Выберите разделы"
      size="md"
    />
    <div class="admin-form__row">
      <UiInput v-model="form.color" label="Цвет" placeholder="#FFFFFF" size="md" maxlength="7" />
      <UiSelect
        v-model="form.brand_id"
        label="Бренд"
        :items="brandItems"
        value-key="id"
        label-key="name"
        placeholder="Выберите бренд"
        size="md"
        class="admin-form__grow"
      />
    </div>
    <UiTextarea
      v-model="form.preview_text"
      label="Краткое описание"
      placeholder="Необязательно"
      :rows="3"
      size="md"
    />
    <UiFileUpload v-model="files" label="Изображения" />
  </form>
</template>

<script setup lang="ts">
export type SelectOption = { id: number; name: string };

export type ProductFormPayload = {
  title: string;
  price: number;
  section_ids: number[];
  color: string;
  preview_text: string;
  brand_id: number | undefined;
  files: File[];
};

const props = withDefaults(
  defineProps<{
    sectionItems?: SelectOption[];
    brandItems?: SelectOption[];
  }>(),
  { sectionItems: () => [], brandItems: () => [] }
);

const emits = defineEmits<{
  (e: 'submit', payload: ProductFormPayload): void;
}>();

const form = ref({
  title: '',
  price: 0,
  section_ids: [] as number[],
  color: '',
  preview_text: '',
  brand_id: undefined as number | undefined
});

const files = ref<File[] | File | null>(null);

function onSubmit() {
  if (!form.value.title?.trim() || form.value.section_ids.length === 0) return;
  if (Number(form.value.price) < 0) return;
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
}

function reset() {
  form.value = {
    title: '',
    price: 0,
    section_ids: [],
    color: '',
    preview_text: '',
    brand_id: undefined
  };
  files.value = null;
}

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

  .admin-form__grow {
    flex: 1;
    min-width: 0;
  }
}
</style>
