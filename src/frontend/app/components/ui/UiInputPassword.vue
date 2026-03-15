<template>
  <div class="ui-field">
    <UiFieldLabel v-if="label" :label="label" :required="required" />
    <UInput
      v-bind="inputAttrs"
      :type="showPassword ? 'text' : 'password'"
      :model-value="modelValue"
      class="ui-input ui-input-password"
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
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'UiInputPassword', inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    label?: string;
    required?: boolean;
  }>(),
  { modelValue: undefined, label: undefined, required: false }
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
.ui-field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.ui-input-password {
  width: 100%;
}

.ui-input-password__trailing {
  display: flex;
  align-items: center;
  padding-right: 0.25rem;
}
</style>
