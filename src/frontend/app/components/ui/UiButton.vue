<template>
  <UButton :label="props.name" @click="$emit('click', $event)" />
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
