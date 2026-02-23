<template>
  <Teleport to="body">
    <Transition name="admin-delete-modal">
      <div
        v-if="open"
        class="admin-delete-modal__overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-delete-modal-title"
        @click.self="emits('close')"
      >
        <div class="admin-delete-modal__box">
          <UiClose @click="emits('close')" />
          <h2 id="admin-delete-modal-title" class="admin-delete-modal__title">
            {{ title }}
          </h2>
          <p v-if="itemName" class="admin-delete-modal__name">
            {{ itemName }}
          </p>
          <div class="admin-delete-modal__actions">
            <UiButton
              color="neutral"
              variant="outline"
              :label="$t('modal.cancel')"
              @click="emits('close')"
            />
            <UiButton color="error" :label="$t('modal.delete')" @click="emits('confirm')" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import UiClose from '~/components/ui/UiClose.vue';

defineProps<{
  open: boolean;
  title: string;
  itemName?: string;
}>();

const emits = defineEmits<{
  (e: 'close' | 'confirm'): void;
}>();
</script>

<style scoped lang="scss">
.admin-delete-modal__overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 1rem;
}

.admin-delete-modal__box {
  position: relative;
  background: var(--ui-bg, #fff);
  border-radius: 12px;
  padding: 1.5rem;
  padding-top: 2.25rem;
  max-width: 24rem;
  width: 100%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15);
}

.admin-delete-modal__close-icon {
  font-size: 1.5rem;
  line-height: 1;
}

.admin-delete-modal__title {
  margin: 0 0 0.75rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--ui-text, #334155);
}

.admin-delete-modal__name {
  margin: 0 0 1.25rem;
  font-size: 1rem;
  color: var(--ui-text, #334155);
}

.admin-delete-modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.admin-delete-modal-enter-active,
.admin-delete-modal-leave-active {
  transition: opacity 0.2s ease;
}
.admin-delete-modal-enter-active .admin-delete-modal__box,
.admin-delete-modal-leave-active .admin-delete-modal__box {
  transition: transform 0.2s ease;
}
.admin-delete-modal-enter-from,
.admin-delete-modal-leave-to {
  opacity: 0;
}
.admin-delete-modal-enter-from .admin-delete-modal__box,
.admin-delete-modal-leave-to .admin-delete-modal__box {
  transform: scale(0.95);
}
</style>
