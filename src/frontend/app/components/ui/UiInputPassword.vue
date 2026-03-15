<template>
  <div class="ui-input-password" :class="{ 'ui-input-password--error': error }">
    <UiFieldLabel v-if="label" :label="label" :required="required" />
    <UInput
      v-bind="inputAttrs"
      :type="showPassword ? 'text' : 'password'"
      :model-value="modelValue"
      :error="!!error"
      class="ui-input-password__input"
      v-on="inputListeners"
    >
      <template #trailing>
        <span class="ui-input-password__trailing">
          <UButton
            color="neutral"
            variant="link"
            size="xs"
            :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
            :aria-label="showPassword ? 'Скрыть пароль' : 'Показать пароль'"
            @click="showPassword = !showPassword"
          />
        </span>
      </template>
    </UInput>
    <Transition name="ui-input-error">
      <p v-if="error" class="ui-input-password__error" role="alert">
        {{ error }}
      </p>
    </Transition>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'UiInputPassword', inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    label?: string;
    required?: boolean;
    error?: string;
  }>(),
  { modelValue: undefined, label: undefined, required: false, error: undefined }
);

const attrs = useAttrs();

const showPassword = ref(false);

const inputAttrs = computed(() => {
  const { type: _type, ...rest } = attrs as Record<string, unknown>;
  return rest;
});

const emits = defineEmits<{
  (e: 'update:modelValue', value: string | undefined): void;
}>();

const inputListeners = computed(() => ({
  'update:modelValue': (v: string | number) => emits('update:modelValue', String(v))
}));
</script>

<style scoped lang="scss">
.ui-input-password {
  display: flex;
  flex-direction: column;

  &__input {
    width: 100%;
    margin-top: 8px;
  }

  &__trailing {
    display: flex;
    align-items: center;
    padding-right: 0.25rem;
  }

  &--error :deep(input) {
    border-color: var(--ui-error, #dc2626);
    outline-color: var(--ui-error, #dc2626);
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
