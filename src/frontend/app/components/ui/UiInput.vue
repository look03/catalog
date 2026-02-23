<template>
  <div class="ui-field">
    <UiFieldLabel v-if="label" :label="label" :required="required" />
    <UInput v-bind="$attrs" :model-value="modelValue" class="ui-input" v-on="inputListeners">
      <template #trailing>
        <button v-if="modelValue" type="button" class="ui-input-filter__clear" @click="clear">
          <span class="ui-input-filter__clear-icon" aria-hidden="true">×</span>
        </button>
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
.ui-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ui-input {
  width: 100%;
}
</style>
