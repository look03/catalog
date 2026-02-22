<template>
  <button type="button" class="ui-close" @click="$emit('click', $event)">
    <span class="admin-delete-modal__close-icon" aria-hidden="true">×</span>
  </button>
</template>

<script setup lang="ts">
defineOptions({
  name: 'UiClose'
});

defineEmits<{
  click: [event: MouseEvent];
}>();
</script>

<style scoped lang="scss">
.ui-close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--ui-text-muted, #64748b);
  cursor: pointer;
  border-radius: 6px;
  transition:
    color 0.15s ease,
    background-color 0.15s ease;

  &:hover {
    color: var(--ui-text, #334155);
    background-color: var(--ui-bg-elevated, #f1f5f9);
  }
}
</style>
