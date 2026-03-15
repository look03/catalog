<template>
  <div class="ui-input">
    <UiFieldLabel v-if="label" :label="label" :required="required" />
    <UInput v-bind="$attrs" :model-value="modelValue" class="ui-input__input" v-on="inputListeners">
      <template #trailing>
        <span v-if="modelValue" class="ui-input__trailing">
          <button type="button" class="ui-input__clear" aria-label="Очистить" @click="clear">
            <span class="ui-input__clear-icon" aria-hidden="true">×</span>
          </button>
        </span>
      </template>
    </UInput>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'UiInput', inheritAttrs: false });

withDefaults(
  defineProps<{
    modelValue?: string | number;
    label?: string;
    required?: boolean;
  }>(),
  { modelValue: undefined, label: undefined, required: false }
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
  gap: 0.5rem;
  &__input {
    width: 100%;
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
}
</style>
