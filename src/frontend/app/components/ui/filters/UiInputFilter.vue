<template>
  <div class="ui-input-filter">
    <label v-if="props.title" class="ui-input-filter__label"> {{ props.title }}</label>
    <UInput
      v-model="model"
      :placeholder="props.placeholder"
      size="md"
      class="ui-input-filter__input"
      @keydown.enter="emits('action:on-search')"
    >
      <template #trailing>
        <button v-if="model" type="button" class="ui-input-filter__clear" @click="clear">
          <span class="ui-input-filter__clear-icon" aria-hidden="true">×</span>
        </button>
      </template>
    </UInput>
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
  get: () => props.value ?? '',
  set: (v: string) => emits('action:input', v)
});

const clear = () => {
  emits('action:input', '');
};
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
