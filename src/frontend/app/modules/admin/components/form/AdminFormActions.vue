<template>
  <div class="admin-form__actions">
    <UiButton
      type="button"
      color="primary"
      :name="submitLabel"
      :loading="loading"
      @click="emits('submit')"
    />
    <UiButton
      color="neutral"
      variant="outline"
      :name="cancelLabel"
      type="button"
      @click="emits('cancel')"
    />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'AdminFormActions' });

withDefaults(
  defineProps<{
    cancelLabel: string;
    submitLabel: string;
    loading?: boolean;
  }>(),
  { loading: false }
);

const emits = defineEmits<{
  (e: 'cancel' | 'submit'): void;
}>();
</script>

<style scoped lang="scss">
.admin-form__actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}
</style>
