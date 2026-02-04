<template>
  <button class="ui-button">
    {{ props.name }}
  </button>
</template>

<script setup lang="ts">
defineOptions({
  name: 'UiButton'
});

defineEmits<{
  click: [event: MouseEvent];
}>();

const props = withDefaults(
  defineProps<{
    name: string;
  }>(),
  {
    name: ''
  }
);
</script>

<style scoped lang="scss">
.ui-button {
  padding: 0.5rem 1rem;
  cursor: pointer;
  border: none;
  background: $local-colors-white-2;
  font-weight: 600;
  transition: background-color 0.3s;
}
</style>
