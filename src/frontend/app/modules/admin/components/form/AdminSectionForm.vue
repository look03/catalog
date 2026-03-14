<template>
  <form class="admin-form admin-form--section" @submit.prevent="onSubmit">
    <UiCheckbox v-if="editIdItem" v-model="sectionForm.active" :label="$t('formSection.active')" />
    <UiInput
      v-model="sectionForm.sectionName"
      :label="$t('formSection.nameSection')"
      required
      :placeholder="$t('formSection.nameSectionPlaceholder')"
      size="md"
    />
    <UiSelect
      v-model="sectionForm.parentSectionId"
      :label="$t('formSection.parentSection')"
      :items="parentSectionItems"
      value-key="id"
      label-key="name"
      :placeholder="$t('formSection.parentSectionPlaceholder')"
      size="md"
    />
  </form>
</template>

<script setup lang="ts">
import { useAdminStore } from '../../stores/adminStore';
import type { SectionForm } from '~/modules/admin/types';

export type SectionOption = { id: number; name: string };

const props = withDefaults(
  defineProps<{
    sectionItems?: SectionOption[];
  }>(),
  { sectionItems: () => [] }
);

const emits = defineEmits<{
  (e: 'action:save-section', payload: SectionForm): void;
  (e: 'action:update-section', id: number, payload: SectionForm): void;
}>();

const adminStore = useAdminStore();
const { sectionForm, editIdItem } = storeToRefs(adminStore);

const parentSectionItems = computed(() => {
  const items = props.sectionItems
    .filter((s) => !editIdItem.value || s.id !== editIdItem.value)
    .map((s) => ({ id: s.id, name: s.name }));
  return [{ id: 0, name: '— Без родителя' }, ...items];
});

const onSubmit = () => {
  if (!sectionForm.value.sectionName?.trim()) {
    return;
  }

  const parentId =
    sectionForm.value.parentSectionId === 0 ? undefined : sectionForm.value.parentSectionId;

  if (editIdItem.value) {
    emits('action:update-section', editIdItem.value, {
      sectionName: sectionForm.value.sectionName.trim(),
      parentSectionId: parentId,
      active: sectionForm.value.active ?? undefined
    });
    return;
  }

  emits('action:save-section', {
    sectionName: sectionForm.value.sectionName.trim(),
    parentSectionId: parentId,
    active: sectionForm.value.active ?? true
  });
};

const reset = () => {
  adminStore.clearSectionForm();
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
</style>
