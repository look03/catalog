<template>
  <ULink :to="props.to">
    {{ props.name }}
  </ULink>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    to: string;
    name: string;
  }>(),
  {
    to: '',
    name: ''
  }
);
</script>

<style scoped lang="scss"></style>
