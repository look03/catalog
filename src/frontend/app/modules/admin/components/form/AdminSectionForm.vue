<template>
  <form class="admin-form admin-form--section" @submit.prevent="onSubmit">
    <UiInput
      v-model="form.title"
      :label="$t('formSection.nameSection')"
      required
      :placeholder="$t('formSection.nameSectionPlaceholder')"
      size="md"
    />
    <UiSelect
      v-model="form.parent_section_id"
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
export type SectionOption = { id: number; name: string };

const props = withDefaults(
  defineProps<{
    sectionItems?: SectionOption[];
  }>(),
  { sectionItems: () => [] }
);

const emits = defineEmits<{
  (e: 'submit', payload: { title: string; parent_section_id?: number }): void;
}>();

const form = ref({
  title: '',
  parent_section_id: undefined as number | undefined
});

const parentSectionItems = computed(() => {
  const items = props.sectionItems.map((s) => ({ id: s.id, name: s.name }));
  return [{ id: 0, name: '— Без родителя' }, ...items];
});

const onSubmit = () => {
  if (!form.value.title?.trim()) {
    return;
  }

  const parentId = form.value.parent_section_id === 0 ? undefined : form.value.parent_section_id;
  emits('submit', {
    title: form.value.title.trim(),
    parent_section_id: parentId
  });
};

const reset = () => {
  form.value = { title: '', parent_section_id: undefined };
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
