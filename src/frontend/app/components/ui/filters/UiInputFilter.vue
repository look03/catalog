<template>
  <div class="ui-input-filter">
    <label v-if="props.title" class="ui-input-filter__label"> {{ props.title }}</label>
    <UInput
      v-model="model"
      :placeholder="props.placeholder"
      size="md"
      class="ui-input-filter__input"
      @keydown.enter="emits('action:on-search')"
    />
  </div>
</template>

<script setup lang="ts">
const emits = defineEmits<{
  (e: 'action:on-search'): void;
  (e: 'action:input', value: string): void;
}>();

const props = withDefaults(
  defineProps<{
    title?: string;
    placeholder?: string;
    value?: string;
  }>(),
  {
    title: undefined,
    placeholder: undefined,
    value: undefined
  }
);

const model = computed({
  get: () => props.value,
  set: (v: string) => emits('action:input', v)
});
</script>

<style scoped lang="scss">
.ui-input-filter {
  flex: 1;
  min-width: 140px;
  max-width: 220px;

  &__label {
    display: block;
    margin-bottom: 0.35rem;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--ui-text, #334155);
  }

  &__input {
    width: 100%;
  }
}
</style>
