<template>
  <div class="ui-input" :class="{ 'ui-input--error': error }">
    <UiFieldLabel v-if="label" :label="label" :required="required" />
    <UInput
      v-bind="$attrs"
      :model-value="modelValue"
      :error="!!error"
      class="ui-input__input"
      v-on="inputListeners"
    >
      <template #trailing>
        <span
          v-if="modelValue !== undefined && modelValue !== null && modelValue !== ''"
          class="ui-input__trailing"
        >
          <button type="button" class="ui-input__clear" aria-label="Очистить" @click="clear">
            <span class="ui-input__clear-icon" aria-hidden="true">×</span>
          </button>
        </span>
      </template>
    </UInput>
    <Transition name="ui-input-error">
      <p v-if="error" class="ui-input__error" role="alert">
        {{ error }}
      </p>
    </Transition>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'UiInput', inheritAttrs: false });

withDefaults(
  defineProps<{
    modelValue?: string | number;
    label?: string;
    required?: boolean;
    error?: string;
  }>(),
  { modelValue: undefined, label: undefined, required: false, error: undefined }
);

const emits = defineEmits<{
  (e: 'update:modelValue', value: string | number | undefined): void;
}>();

const inputListeners = computed(() => ({
  'update:modelValue': (v: string | number) => emits('update:modelValue', v)
}));

const clear = () => {
  emits('update:modelValue', undefined);
};
</script>

<style scoped lang="scss">
.ui-input {
  display: flex;
  flex-direction: column;

  &--error :deep(input) {
    border-color: var(--ui-error, #dc2626);
    outline-color: var(--ui-error, #dc2626);
  }

  &__input {
    width: 100%;
    margin-top: 8px;
  }

  &__trailing {
    display: flex;
    align-items: center;
  }

  &__clear {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin: 0 -0.25rem 0 0;
    width: 1.25rem;
    height: 1.25rem;
    border: none;
    border-radius: 4px;
    background: transparent;
    color: #94a3b8;
    cursor: pointer;
    transition:
      color 0.2s ease,
      background 0.2s ease;
  }

  &__clear:hover {
    color: #64748b;
    background: #f1f5f9;
  }

  &__clear-icon {
    font-size: 1.125rem;
    line-height: 1;
  }

  &__error {
    margin: 4px 4px 0;
    font-size: 12px;
    line-height: 16px;
    color: var(--ui-error, #dc2626);
  }
}

.ui-input-error-enter-active,
.ui-input-error-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.ui-input-error-enter-from,
.ui-input-error-leave-to {
  opacity: 0;
  transform: translateY(-0.25rem);
}
</style>
