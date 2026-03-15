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
    <UiSectionTreeSelect
      v-model="parentSectionIdModel"
      :label="$t('formSection.parentSection')"
      :items="props.sectionItems"
      :placeholder="$t('formSection.parentSectionPlaceholder')"
      :exclude-id="editIdItem ?? undefined"
    />
  </form>
</template>

<script setup lang="ts">
import { useAdminStore } from '../../stores/adminStore';
import type { SectionForm } from '~/modules/admin/types';

export type SectionTreeItem = {
  id: number;
  name: string;
  title?: string;
  parentSectionId?: number | null;
};

const props = withDefaults(
  defineProps<{
    sectionItems?: SectionTreeItem[];
  }>(),
  { sectionItems: () => [] }
);

const emits = defineEmits<{
  (e: 'action:save-section', payload: SectionForm): void;
  (e: 'action:update-section', id: number, payload: SectionForm): void;
}>();

const adminStore = useAdminStore();
const { sectionForm, editIdItem } = storeToRefs(adminStore);

const parentSectionIdModel = computed({
  get: () => sectionForm.value.parentSectionId ?? 0,
  set: (v: number) => {
    sectionForm.value.parentSectionId = v === 0 ? undefined : v;
  }
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
