<template>
  <UPopover v-bind="$attrs">
    <template #default="{ open }">
      <slot :open="open" />
    </template>

    <template #content="scope">
      <slot name="content" v-bind="scope" />
    </template>

    <template v-if="$slots.anchor" #anchor="scope">
      <slot name="anchor" v-bind="scope" />
    </template>
  </UPopover>
</template>

<script setup lang="ts">
defineOptions({
  name: 'UiPopover',
  inheritAttrs: false
});

defineSlots<{
  default(props: { open: boolean }): unknown;
  content(props: { close?: () => void }): unknown;
  anchor(props: Record<string, unknown>): unknown;
}>();
</script>
